import { merge } from 'lodash-es'
import appState from '../../app/reducer.js'
import notification from '../../components/Notification/index.jsx'
import { decodeAdv } from '../../helpers.js'
import { store } from '../../main.jsx'
import typeMessage from '../typeMessage/index.js'

let WSSContext = {}
let isLog = true

const RECONNECT_DELAY = 150
const MAX_RECONNECT_DELAY = 3000
const TIMEOUT_REQUEST = 10000

const changeReconnectDelay = () => {
	WSSContext._reDelay = Math.min(WSSContext._reDelay * 1.2, MAX_RECONNECT_DELAY)
}

const { removeNotification } = appState.actions

const connector = function (host, onOpen, onError, onClose, reconnect) {
	try {
		const ws = new WebSocket(host)
		ws.binaryType = "arraybuffer";
		ws.onopen = e => {
			isLog && console.log('[WSS] Connected')
			WSSContext.context = ws
			WSSContext._reDelay = RECONNECT_DELAY
			if (WSSContext.queues.length) {
				WSSContext.runQueue()
			}
			if (Object.keys(WSSContext.stocks).length)
				WSSContext.set(WSSContext.stocks, false)
			onOpen(e)
		}
		ws.onmessage = async e => {
			const { name, data } = typeMessage.decode( new Uint8Array(e.data))
			if (name === 'req') {
				const prom = WSSContext.promise
				const req = prom[data.id]
				clearTimeout(WSSContext._timeout[data.id])
				store.dispatch(removeNotification('error-connect'))

				if (req) {
					if(!data.data){
						data.data = [500, __("An error has occurred :(")]
					}
					req[0](decodeAdv(data.data))
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
					changeReconnectDelay()
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
		_reDelay: RECONNECT_DELAY,
		_timeout: {},
		_timerLast: {},
		queues: [],
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
				WSSContext._timeout[this.id] = setTimeout(() => {
					notification.error(
					  __('Connection issues with the server. Please check your internet connection or refresh the page.'),
					  { slug: 'error-connect' },
					)
				}, TIMEOUT_REQUEST)
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

			if (readyState !== undefined && readyState === OPEN) {
				context.send(typeMessage.encode({ name, data }))
				WSSContext._reDelay = RECONNECT_DELAY
				return true
			} else {
				WSSContext.queues.push([name, data])
				changeReconnectDelay()
				return false
			}
		},
		runQueue () {
			setTimeout(() => {
				while (this.queues.length) {
					const queue = this.queues.shift()
					if (!WSSContext.emit(...queue)) break
				}
			}, 50)
		},
	}

	WSSContext = res
	return res
}
