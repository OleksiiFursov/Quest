import { readdirSync } from 'fs'
import path from 'path'
import { join, parse } from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'

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

export function makeDate (date) {
	date = date / 1000 >> 0

	const buf = []
	if (date > 86400) {
		buf.push(((date / 86400) >> 0) + 'd')
	}
	if (date > 3600) {
		const _t = (date / 3600) % 24 >> 0
		if (_t) {
			buf.push(_t + 'h')
		}
	}
	if (date > 60) {
		const _t = (date / 60) % 60 >> 0
		if (_t) {
			buf.push(_t + 'm')
		}
	}
	const _t = date % 60
	if (_t) {
		buf.push(_t + 's')
	}
	return buf.join(' ') || 'just'
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
	console.error(msg)
}

export async function importFolder (pathFolder) {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)

	// Функция для импорта всех файлов из директории
	const filesData = {}

	// Импорт всех файлов из директории
	const files = readdirSync(pathFolder)

	// Обработка каждого файла
	for (const file of files) {
		// Получение полного пути к файлу
		const filePath = join(pathFolder, file)

		// Использование названия файла в качестве ключа
		const fileName = parse(file).name

		// Импорт файла и добавление его в объект
		filesData[fileName] = await import(pathFolder + file) // Пример чтения содержимого файла
	}

	return filesData

}
