import config from '#config.js'
import typeMessage from '#helpers/typeMessage.js'
import { WebSocketServer } from 'ws'
import { readFileSync } from 'fs'
import { nanoid } from 'nanoid'
import { controllersInit, controllersOn } from '#loader.js'
import { deepClone, formatDate, getConfig } from '#tools.js'
import db from '#db.js'

let options = {}
if (config.isSSL) {
    options = {
        cert: readFileSync('/path/to/cert.pem'),
        key: readFileSync('/path/to/key.pem'),
    }
}

//STORE:
const _USERS = {}
const _DATA = {
    stats: {
        maxOnline: 0,
        allConnect: 0,
        startMemory: process.memoryUsage(),
        startDate: new Date().valueOf(),
        all: {},
    },
    errors: [],
    usersDisconnect: new Map(),
}

const storeInit = () => ({
    page: '',
    pageHistory: [],
})

const all = callback => Object.values(_USERS).forEach(callback)

const context = nToken => ({
    nToken,
    wssConnect: nToken ? _USERS[nToken].wss : null,
    state: nToken ? _USERS[nToken].state : null,
    currentUser: _USERS[nToken],
    all,
    db,
    data: _DATA,
    users: _USERS,
    config: deepClone(config),
    emit (name, data = null, allUsers = false) {

        const str = typeMessage.encode({ name, data })
        if (!nToken || allUsers) {
            all(self => self.wss.send(str))
            return this
        }
        this.wssConnect.send(str, {binary : true})
        return data
    },
    error (msg) {
        this.emit('error', msg)
    },
    notice (msg) {
        this.emit('notice', msg)
    },
    global: token => context(token),
})

const HandlerOn = (message, name) => {
    controllersOn(context(name), message)
}

const wss = new WebSocketServer({ port: config.wss.port })

const onClose = (ws, nToken, $context) => {
    //ws.off('message', HandlerOn)
    if (_USERS[nToken].state.username !== 'guest')
        _DATA.usersDisconnect.set(_USERS[nToken].state.username, Object.assign({
            date: _USERS[nToken].date,
            sessionEnd: formatDate(),
        }, deepClone(_USERS[nToken].state)))
    delete _USERS[nToken]
    $context = null
}

wss.on('connection', (ws, req) => {
    ws.on('error', console.error)
    const nToken = nanoid()

    _DATA.stats.allConnect++
    _USERS[nToken] = {
        wss: ws,
        date: new Date().valueOf(),
        userAgent:req.headers['user-agent'],
        state: storeInit(),
        ip: ws._socket.remoteAddress,
    }

    let $context = context(nToken)
    controllersInit($context, _USERS)

    ws.on('message', message => HandlerOn(message, nToken))
    ws.on('close', () => onClose(ws, nToken, $context))
})
