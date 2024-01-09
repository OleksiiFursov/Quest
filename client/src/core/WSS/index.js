import { parseJSON } from '@crossfox/utils'
import { merge } from 'lodash-es'

let WSSContext = {}
let isLog = true

const connector = function (host, onOpen, onError, onClose, reconnect) {
	try {
		const ws = new WebSocket(host)

		ws.onopen = e => {
			isLog && console.log('WSS: Connected')
			WSSContext.context = ws
			if (Object.keys(WSSContext.stocks).length)
				WSSContext.set(WSSContext.stocks, false)
			onOpen(e)
		}
		ws.onmessage = e => {
			const { name, data } = parseJSON(e.data)

			if (name === 'req') {
				const prom = WSSContext.promise
				const req = prom[data.id]

				if (req) {
					req[0](data.data)
					delete prom[data.id]
					return
				}
				return null
			}

			if (name === 'error') {
				console.error(data)
				return
			}
			if (name === 'notice') {
				console.warn(data)
				return
			}

			for (const event of WSSContext.events) {
				if (!event.name || event.name === name) {
					event.callback(data, e)
				}
			}
		}
		ws.onclose = e => {
			onClose(e)
			if (reconnect) {
				setTimeout(() => {
					connector(...arguments)
					isLog && console.log('WSS: reconnecting');
					WSSContext._reDelay = Math.min(WSSContext._reDelay*1.2, 5000);
				}, WSSContext._reDelay)
			}
		}
		ws.onerror = e => {
			onError(e)
			console.log(e)
			WSSContext.errors.push(e)
			ws.close()
		}
		return ws
	} catch (e) {
		console.error(e)
		return null
	}

}
export default function connectSocket (params = {}) {
	const {
		host = 'ws://localhost:9999',
		multiConnect = false,
		reconnect = true,
		onError = function () {},
		onClose = function () {},
		onOpen = function () {},
	} = params

	if (WSSContext.context && (multiConnect || WSSContext.context.readyState === 1))
		return WSSContext

	connector(host, onOpen, onError, onClose, reconnect)
	const res = {
		stocks: {},
		events: [],
		errors: [],
		id: 0,
		eventID: 0,
		promise: {},
		_reDelay: 150,
		_timerLast: {},
		onForce (name, callback) {
			const eventId = this.has(name) || this.events.length;
			this.events[eventId] = { name, callback }
			return this
		},
		on (name, callback, check = true) {
			if (!check || !~this.has(name, callback)){
				this.eventID = this.events.push({ name, callback })
			}
			return this
		},
		has (name, callback) {
			return this.events.findIndex(event => event.name === name && (!callback || event.callback === callback))
		},
		off (name, callback) {
			if (!isNaN(name)) {
				this.events.splice(name, 1)
				return this
			}
			const index = this.events.findIndex(event => event.name === name && event.callback === callback)
			this.events.splice(index, 1)
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
			const context = WSSContext.context || {}
			const { readyState, OPEN } = context

			if (readyState === OPEN) {
				context.send(JSON.stringify({ name, data }))
				this._reDelay = 150
			} else {
				setTimeout(() => {
					this._reDelay = Math.min(5000, this._reDelay * 1.2)
					this.emit.apply(this, arguments)
				}, this._reDelay)
			}
			return this
		},
	}

	WSSContext = res
	return res
}
