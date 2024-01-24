import { parseJSON } from '@crossfox/utils'
import { MsgPackEncoder } from 'json-joy/es6/json-pack/msgpack/MsgPackEncoder.js'
import { MsgPackDecoder } from 'json-joy/es6/json-pack/msgpack/MsgPackDecoder.js'
import { error, getConfig } from '@/helpers.js'

const type = getConfig('wss.type', 'msgpack')

const m = new MsgPackEncoder()
const d = new MsgPackDecoder()

const typeMessage = type === 'msgpack' ? {
	encode (msg) {
		try {
			return m.encode(msg)
		} catch (e) {
			error('[typeMessage] Error encode msg.', [e, msg])
		}
	},
	decode (msg) {
		try {
			return d.decode(msg)
		} catch (e) {
			error('[typeMessage] Error decode msg.', [e, msg])
		}
	},
} : {
	encode: msg => parseJSON(msg.toString()),
	decode: JSON.stringify,
}

export default typeMessage

