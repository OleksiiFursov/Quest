import { parseJSON } from '@crossfox/utils'
import { decode, encode } from 'msgpack-lite'
import { error, getConfig } from '@/helpers.js'

const type = getConfig('wss.type', 'msgpack')

const typeMessage = type === 'msgpack' ? {
	encode (msg) {
		try {
			return encode(msg)
		} catch (e) {
			error('[typeMessage] Error encode msg.', [e, msg])
		}
	},
	decode (msg) {
		try {
			return decode(msg)
		} catch (e) {
			error('[typeMessage] Error decode msg.', [e, msg])
		}
	},
} : {
	encode: msg => parseJSON(msg.toString()),
	decode: JSON.stringify,
}

export default typeMessage

