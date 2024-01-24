import { readdirSync } from 'fs'
import { dirname } from 'path'
import { parse } from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'
import Resp from './helpers/Resp.mjs'

export function deepClone (obj) {
	const clObj = {}
	for (const i in obj) {
		clObj[i] = obj[i] instanceof Object ? deepClone(obj[i]) : obj[i]
	}
	return clObj
}

export function isObject (item) {
	return (item && typeof item === 'object' && !Array.isArray(item))
}

export function merge (target, ...sources) {
	if (!sources.length) return target
	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} })
				merge(target[key], source[key])
			} else {
				Object.assign(target, { [key]: source[key] })
			}
		}
	}
	return merge(target, ...sources)
}

export function formatDate (ms) {
	if (!ms) {
		ms = new Date()
	}
	if (typeof ms === 'number') {
		ms = new Date(ms)
	}
	const f = a => ('' + a).padStart(2, '0')

	return f(ms.getFullYear()) + '-' + f(ms.getMonth()) + '-' + f(ms.getDate()) + ' ' +
	  f(ms.getHours()) + ':' + f(ms.getMinutes()) + ':' + f(ms.getSeconds())

}

export function makeSize (bytes) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	let unit = 0
	do {
		if (bytes < 1000) break
		unit++
	} while (bytes /= 1024)
	return (+bytes.toFixed(3)) + ' ' + units[unit]
}

export function normalizeObject (arr) {
	const a = Array.isArray(arr) ? [] : {}
	for (const key in arr) {
		if (arr[key] instanceof Set) {
			a[key] = Array.from(arr[key])
		} else if (arr[key] instanceof Map) {
			a[key] = Object.fromEntries(arr[key])
		} else if (arr[key] instanceof Object) {
			a[key] = normalizeObject(arr[key])
		} else {
			a[key] = arr[key]
		}
	}
	return a
}

export function rand (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function createToken (length = 64) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890^%_-$#'
	let res = ''
	for (let i = 0; i < length; i++) {
		res += alphabet[rand(0, alphabet.length)]
	}
	return res
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

export function error (msg) {
	console.error(msg);
	return Resp.error(msg);
}

export function getCurrentDirectory(path){
	const __filename = fileURLToPath(path || import.meta.url)
	return dirname(__filename);
}
export async function importFolder (pathFolder, method) {
	const filesData = {}

	const files = readdirSync(pathFolder)

	if (process.platform === 'win32') {
		pathFolder ='file://' + pathFolder;
	}

	for (const file of files) {
		const fileName = parse(file).name
		let imp =  await import(pathFolder +'/'+ file);
		if(method){
			imp = imp[method];
		}
		filesData[fileName] = imp// Пример чтения содержимого файла
	}
	return filesData

}


export function sendNormalized(obj){
	for(const key in obj){
		if(typeof obj[key] === 'function'){
			obj[key] = obj[key].toString();
		}else if(typeof obj[key] === 'object'){
			sendNormalized(obj[key]);
		}
	}
	return obj;
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
				}else{
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
