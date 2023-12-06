import config from '/config.js';
import {merge, uniqueId} from "lodash-es";

const EVENTS = [];

export default function connectSocket(params) {
    if(window?.WSS?.context?.readyState === 1) return window.WSS;
    let ws;
    try{
        ws = new WebSocket(config.wss.host);
    } catch(e){
        ws = {}
    }

    const args = Object.assign({
        reconnect: true,
        onError: error => {
            setTimeout(()=>{
                window.WSS.errors.push(error);
            }, 100)
            ws.close();
        }
    }, params);

    ws.onopen = e => {
        window.WSS.set(window.WSS.stocks, false)
        if('onOpen' in args){
            args.onOpen(ws, e);
        }
    }

    ws.onmessage = function(e) {
        const {name, data} = JSON.parse(e.data);

        if(name === 'error'){
            console.error(data);
            return;
        }
        if(name === 'notice'){
            console.warn(data);
            return;
        }
        if(name === 'command'){
            if(window.WSS.commands[data.id]){
                window.WSS.commands[data.id](data.data);
                delete window.WSS.commands[data.id];
                return;
            }
            return null;
        }
        for(const EVENT of EVENTS){
            if(!EVENT.name || EVENT.name === name){

                EVENT.callback(data, e);
            }
        }
    }

    ws.onclose = e => {
        if('onClose' in args){
            args.onClose(e);
        }
        if(args.reconnect && location.host.search('localhost') === -1){
            setTimeout(() => {
                window.WSS.context = connectSocket(params).context
            }, 1000);
        }
    };

    ws.onerror = args.onError;

    return {
        context: ws,
        stocks: {},
        events: EVENTS,
        commands: {},
        errors: [],
        eventID: 0,
        id:0,
        _timerLast: {},
        onForce(name, callback){
            const eventId = this.has(name);
            if(~eventId){
                EVENTS[eventId] = {name, callback};
            }else{
                EVENTS.push({name, callback});
            }
            return this;
        },
        on(name, callback, check = true) {
            if(check && ~this.has(name, callback)){
                return this;
            }
            this.eventID = EVENTS.push({name, callback});
            return this;
        },
        has(name, callback) {
            for(let i = 0, len = EVENTS.length; i < len; i++){
                if(EVENTS[i].name === name && (!callback || EVENTS[i].callback === callback)){
                    return i;
                }
            }
            return -1;
        },
        off(name, callback) {
            if(!isNaN(name)){
                EVENTS.splice(name, 1);
                return this;
            }

            for(let i = 0, len = EVENTS.length; i < len; i++){
                if(EVENTS[i].name === name && EVENTS[i].callback === callback){
                    EVENTS.splice(i, 1);
                    break;
                }
            }
            return this;
        },
        set(data, saveStock = true) {

            if(saveStock)
                this.stocks = merge(this.stocks, data);

            this.emit('set', data);
            return this;
        },
        req(path, data, res) {

            this.emit('req', [
                path,
                {
                    response: res !== undefined,
                    id: this.id++
                },
                data
            ]);
            return this;
        },
        setLast(name, data, timeout = 75) {
            if(this._timerLast[name]){
                clearTimeout(this._timerLast[name])
            }
            this._timerLast[name] = setTimeout(() => this.set(data), timeout);
            return this;
        },
        command(query, data={}, callback) {
            const id = uniqueId();

            if(typeof data === 'function'){
                callback = data;
                data = {}
            }

            this.emit('command', {
                query,
                id,
                data
            });
            this.commands[id] = callback || console.log;
            return this;
        },
        emit(name, data, step) {
            if(!this.context || this.context?.readyState === undefined){
                console.log('WSS is not completed');
                return this;
            }
            if(this.context?.readyState === this.context?.OPEN){
                this.context.send(JSON.stringify({name, data}));
            }else{
                setTimeout(() => {
                    step *= 1.2;
                    this.emit.apply(this, arguments);
                }, Math.min(15000, 150 * step));

            }
            return this;
        }
    };
}
