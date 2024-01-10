import { parseJSON } from '@crossfox/utils'
import { merge } from 'lodash-es'

let WSSContext = {}
let isLog = true

const connector = function (host, onOpen, onError, onClose, reconnect) {
	console.log('con');
	try {
		const ws = new WebSocket(host)

		ws.onopen = e => {
			isLog && console.log('[WSS] Connected')
			WSSContext.context = ws
			WSSContext._reDelay = 150
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
					isLog && console.log('[WSS] reconnecting')
					WSSContext._reDelay = Math.min(WSSContext._reDelay * 1.2, 3000)
				}, WSSContext._reDelay)
			}
		}
		ws.onerror = e => {
			onError(e)
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
		reconnect = true,
		onError = function () {},
		onClose = function () {},
		onOpen = function () {},
	} = params

	if (WSSContext.context && WSSContext.context.readyState === 1)
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
		queues: [],
		onForce (name, callback) {
			const eventId = this.has(name) || this.events.length
			this.events[eventId] = { name, callback }
			return this
		},
		on (name, callback, check = true) {
			if (!check || !~this.has(name, callback)) {
				this.eventID = this.events.push({ name, callback })
			}
			return this
		},
		has (name, callback) {
			return this.events.findIndex(e => e.name === name && (!callback || e.callback === callback))
		},
		off (name, callback) {
			if (!isNaN(name)) {
				this.events.splice(name, 1)
				return this
			}
			const index = this.events.findIndex(e => e.name === name && e.callback === callback)
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
		emit (name, data, queuePos = 'push') {
			const context = WSSContext.context || {}
			const { readyState, OPEN } = context

			if (readyState !== undefined && readyState === OPEN) {
				context.send(JSON.stringify({ name, data }))
				WSSContext._reDelay = 150
				return true
			} else {
				WSSContext.queues[queuePos]([name, data])
				WSSContext._reDelay = Math.min(3000, WSSContext._reDelay * 1.2)
				this.runQueue()
				return false
			}
		},
		runQueue () {
			setTimeout(() => {
				isLog && console.log('[WSS] try connecting');
				while (this.queues.length) {
					const queue = this.queues.shift()
					if (!WSSContext.emit(...queue)) break
				}
			}, WSSContext._reDelay)
		},
	}

	WSSContext = res
	return res
}
