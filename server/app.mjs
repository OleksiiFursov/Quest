import { WebSocketServer } from 'ws'
import { readFileSync } from 'fs'
import config from './config.mjs'
import { nanoid } from 'nanoid'
import { controllersInit, controllersOn } from './loader.mjs'
import { deepClone, formatDate } from './tools.mjs'
import db from './db.mjs'

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
  store: nToken ? _USERS[nToken].store : null,
  all,
  db,
  data: _DATA,
  users: _USERS,
  config: deepClone(config),
  emit (name, data = null, allUsers = false) {
    if (!nToken || allUsers) {
      all(self => self.wss.send(JSON.stringify({ name, data })))
      return this
    }
    this.wssConnect.send(JSON.stringify({ name, data }))
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

const wss = new WebSocketServer({ port: 9999 })

const onClose = (ws, nToken, $context) => {
  ws.off('message', HandlerOn)
  if (_USERS[nToken].store.username !== 'guest')
    _DATA.usersDisconnect.set(_USERS[nToken].store.username, Object.assign({
      date: _USERS[nToken].date,
      sessionEnd: formatDate(),
    }, deepClone(_USERS[nToken].store)))
  delete _USERS[nToken]
  $context = null
}

wss.on('connection', (ws) => {
  ws.on('error', console.error)

  const nToken = nanoid()

  _DATA.stats.allConnect++

  _USERS[nToken] = {
    wss: ws,
    date: new Date().valueOf(),
    store: storeInit(),
    ip: ws._socket.remoteAddress,
  }

  let $context = context(nToken)
  controllersInit($context, _USERS)

  ws.on('message', message => HandlerOn(message, nToken))
  ws.on('close', () => onClose(ws, nToken, $context))
})
