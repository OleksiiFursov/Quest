import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';
import config from './config.mjs';
import {nanoid} from "nanoid";
import {controllersInit, controllersOn} from "./loader.mjs";
import {deepClone, formatDate} from "./tools.mjs";


let options = {};
if(config.isSSL){
    options = {
        cert: readFileSync('/path/to/cert.pem'),
        key: readFileSync('/path/to/key.pem')
    };
}


//STORE:
const _USERS = {};
const _DATA = {
    stats: {
        maxOnline: 0,
        allConnect: 0,
        startMemory: process.memoryUsage(),
        startDate: new Date().valueOf(),
        all: {},
    },
    usersDisconnect: new Map()
};

const storeInit = () => ({
    page: '',
    pageHistory: []
    // watchOnline: false,
    // watchUsers: false,
});

const all = callback => Object.values(_USERS).forEach(callback);
let currentConfig = deepClone(config);
const context = token => ({
    token,
    wssConnect: token ? _USERS[token].wss : null,
    store: token ? _USERS[token].store : null,
    all,
    _DATA,
    _USERS,
    config: currentConfig,
    emit(name, data = null, allUsers = false) {
        if (!token || allUsers) {
            all(self => self.wss.send(JSON.stringify({name, data})))
            return this;
        }
        this.wssConnect.send(JSON.stringify({name, data}));
        return data;
    },
    error(msg) {
        this.emit('error', msg);
    },
    notice(msg) {
        this.emit('notice', msg);
    },
    global: token => context(token)
});

const HandlerOn = (message, name) => {
    controllersOn(context(name), message);
};

const wss = new WebSocketServer({ port: 9999});

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    const name = nanoid();


    _DATA.stats.allConnect++;
    _USERS[name] = {
        wss: ws,
        date: new Date().valueOf(),
        store: storeInit(),
        ip: ws._socket.remoteAddress
    };
    let $context = context(name);
    controllersInit($context, _USERS);
    ws.on('message', message => HandlerOn(message, name));
    ws.on('close', () => {
        ws.off('message', HandlerOn);
        if (_USERS[name].store.username !== 'guest')
            _DATA.usersDisconnect.set(_USERS[name].store.username, Object.assign({
                date: _USERS[name].date,
                sessionEnd: formatDate(),
            }, deepClone(_USERS[name].store)))
        delete _USERS[name];
        $context = null;
    });

    ws.send('something');
});
