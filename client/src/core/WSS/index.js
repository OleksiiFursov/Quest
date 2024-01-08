import { merge } from 'lodash-es'

let lastWSS = {}

export default function connectSocket (params={}) {
    const {
        host='ws://localhost:9999',
        multiConnect = false,
        reconnect = true,
        onError = function () {},
        onClose = function () {},
        onOpen = function () {},
    } = params

    if (lastWSS.context && (multiConnect || lastWSS.context.readyState === 1))
        return lastWSS

    const ws = (() => {
        try {
            return new WebSocket(host)
        } catch (e) {
            console.error(e);
            return {}
        }
    })()

    const res = {
        context: ws,
        stocks: {},
        rand: Math.random(),
        events: [],
        errors: [],
        eventID: 0,
        _reDelay: 150,
        id: 0,
        promise: {},
        _timerLast: {},
        onForce (name, callback) {
            const eventId = this.has(name)
            const data = { name, callback }
            if (~eventId) {
                this.events[eventId] = data
            } else {
                this.events.push(data)
            }
            return this
        },
        on (name, callback, check = true) {
            if (check && ~this.has(name, callback)) {
                return this
            }
            this.eventID = this.events.push({ name, callback })
            return this
        },
        has (name, callback) {
            for (let i = 0, len = this.events.length; i < len; i++) {
                if (this.events[i].name === name && (!callback || this.events[i].callback === callback)) {
                    return i
                }
            }
            return -1
        },
        off (name, callback) {
            if (!isNaN(name)) {
                this.events.splice(name, 1)
                return this
            }

            for (let i = 0, len =  this.events.length; i < len; i++) {
                if ( this.events[i].name === name &&  this.events[i].callback === callback) {
                    this.events.splice(i, 1)
                    break
                }
            }
            return this
        },
        set (data, saveStock = true) {
            if (saveStock)
                this.stocks = merge(this.stocks, data)

            this.emit('set', data)
            return this
        },
        req (path, data, res) {

            return new Promise((resolve, reject) => {
                this.promise[this.id] = [resolve, reject]
                this.emit('req', [
                    path,
                    {
                        response: res !== undefined,
                        id: this.id++,
                    },
                    data,
                ])

            })
        },
        setLast (name, data, timeout = 75) {
            if (this._timerLast[name]) {
                clearTimeout(this._timerLast[name])
            }
            this._timerLast[name] = setTimeout(() => this.set(data), timeout)
            return this
        },
        emit (name, data) {
            const context = this.context || {};
            const {readyState, OPEN} = context;

            if (readyState === undefined) {
                console.log('WSS is not completed', this);
                return this
            }
            if (readyState === OPEN) {
                context.send(JSON.stringify({ name, data }))
                this._reDelay = 150;
            } else {
                console.log('error', this.rand, readyState);
                setTimeout(() => {
                    this._reDelay = Math.min(5000, this._reDelay * 1.2)
                    this.emit.apply(this, arguments)
                }, this._reDelay)

            }
            return this
        },
    }
    ws.onopen = e => {
        console.log("WSS: Connected");
        if (Object.keys(lastWSS.stocks).length)
            lastWSS.set(lastWSS.stocks, false)
        onOpen(e)
    }

    ws.onmessage = e => {
        const { name, data } = JSON.parse(e.data)

        if (name === 'error') {
            console.error(data)
            return
        }
        if (name === 'notice') {
            console.warn(data)
            return
        }
        if (name === 'req') {
            const prom = lastWSS.promise;
            const req = prom[data.id];
            if (req) {
                req[0](data.data)
                delete prom[data.id]
                return
            }
            return null
        }
        for (const event of lastWSS.events) {
            if (!event.name || event.name === name) {
                event.callback(data, e)
            }
        }
    }

    ws.onclose = e => {
        onClose(e)
        if (reconnect) {
            setTimeout(() => {
                res.context = connectSocket(params).context
                console.log('reconnecting');
            }, 1000)
        }
    }

    ws.onerror = e => {
        setTimeout(() => {
            onError(e)
            lastWSS.errors.push(e)
        }, 100)
        ws.close()
    }


    console.log(res.rand);
    lastWSS = res;
    return res;
}
