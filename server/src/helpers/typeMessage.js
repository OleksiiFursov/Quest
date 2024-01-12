import { parseJSON } from '@crossfox/utils'
import { error, getConfig } from '../tools.js'
import { decode, encode } from 'msgpack-lite';
const type = getConfig('wss.type', 'msgpack');

const typeMessage =  type === 'msgpack' ? {
	encode(msg){
		try{
			return encode(msg)
		}catch(e){
			error('[typeMessage] Error encode msg.', [e, msg])
		}
	},
	decode(msg){
		try{
			return decode(msg)
		}catch(e){
			error('[typeMessage] Error decode msg.', [e, msg])
		}
	},
}: {
	encode: msg => parseJSON(msg.toString()),
	decode: JSON.stringify
};

export default typeMessage;

