import config from '../config.js'

export function setState (key, value) {
	return prev => {
		prev[key] = value
		return { ...prev }
	}
}

export function isDiff (a, b) {
	return JSON.stringify(a) !== JSON.stringify(b)
}

export function ucFirst (word) {
	return word[0].toUpperCase() + word.slice(1)
}

export function crop (obj, keys) {
	const res = {}
	for (const key of keys) {
		res[key] = obj[key]
	}
	return res
}

export function error (msg, obj = []) {
	console.error(msg, obj)
}

export function debounce (func, delay = 300) {
	let timerId

	return function (...args) {
		if (timerId) {
			clearTimeout(timerId)
		}

		timerId = setTimeout(() => {
			func.apply(this, args)
			timerId = null
		}, delay)
	}
}

export function getConfig (path, def = {}) {
	path = path.split('.')
	let current = config
	do {
		const item = path.shift()
		current = current[item]
		if (!current) {
			error('Invalid config path "' + path + '"')
			return def
		}
	} while (path.length)
	return current
}

export function map (obj, call) {
	const res = {}
	for (const key in obj) {
		res[key] = call(obj[key], key)
	}
	return res
}

export function setObjectPath (obj, ...params) {
	const value = params.pop()
	const property = params.pop()

	let cur = obj
	for (const path of params) {
		if (!cur[path]) {
			cur[path] = {}
		}
		cur = cur[path]
	}
	cur[property] = value
}

export function encodeAdv (obj) {
	for (const key in obj) {
		const item = obj[key]
		const type = typeof item
		if (type === 'function') {
			obj[key] = '￯F' + item
		} else if (type === 'object') {
			if (item instanceof RegExp) {
				if (item.flags) {
					obj[key] = '￯r' + item.source + '￯' + item.flags
				} else {
					obj[key] = '￯R' + item.source
				}

			} else if (item instanceof Date) {
				obj[key] = '￯D' + item.valueof()
			} else {
				encodeAdv(item)
			}
		}
	}
	return obj
}

export function decodeAdv (obj) {
	for (const key in obj) {
		let item = obj[key]
		const type = typeof item
		if (type === 'string') {
			if (item[0] === '￯') {
				const format = item[1]
				item = item.slice(2)
				if (format === 'F') {
					obj[key] = Function('return ' + item)()
				} else if (format === 'R') {
					obj[key] = RegExp(item)
				} else if (format === 'r') {
					obj[key] = RegExp(...item.split('￯'))
				} else if (format === 'D') {
					obj[key] = new Date(item)
				}
			}
		} else if (type === 'object') {
			decodeAdv(item)
		}
	}
	return obj
}

export const maskValue = (v, mask, clearExp = /\s+|[^0-9]+/g) => {
	const clearValue = v.replace(clearExp, ''),
	  len = clearValue.length

	let buf = ''
	for (let i = 0, j = 0; j < len && i < mask.length; i++) {
		buf += mask[i] === 'X' ? clearValue[j++] : mask[i]
	}

	return buf
}

export async function asyncFetch (url, options = {}) {
	return new Promise(async (resolve) => {
		let res = await fetch(url, options).then(v => v.json());
		if(res.ok){
			res = await res.json();
			return resolve(res);
		}
		console.error(res);
		resolve(null)
	})
}
