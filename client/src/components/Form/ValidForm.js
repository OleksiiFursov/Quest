import { error } from '@/helpers.js'
import api from '@/core/Api/index.js'

const validWithMsg = (valid, msg) => Array.isArray(valid) ? valid : [valid, msg]

const getValidateError = {
	require (value, obj) {
		const [, msg] = validWithMsg(obj, __('Field is empty'))
		return value === '' && msg
	},
	pattern (value, obj) {
		const [reg, msg] = validWithMsg(obj, __('Field is not correct'))
		return !RegExp(reg).test(value) && msg
	},
	min (value, obj) {
		const [min, msg] = validWithMsg(obj, __('Field is too short'))
		return value.length < min && msg
	},
	max (value, obj) {
		const [max, msg] = validWithMsg(obj, __('Field is too long'))
		return value.length > max && msg
	},
	check (value, obj, values) {
		let [call, msg] = validWithMsg(obj, __('Field is not correct'))
		call = new Function('return ' + call)()
		return !call(value, values) && msg
	},
	async afterCheck (value, obj, values) {
		let [req, msg] = validWithMsg(obj, __('Field is not correct'))
		const [, data] =  await api.send('formValid/' + req, { value, values });
		return !data && msg;
	},
}

export default function getValidate (value, rule, values) {
	value = value || ''
	try {
		for (const key in rule) {
			const error = getValidateError[key](value, rule[key], values)

			if (error) {
				return error
			}
		}
	} catch (e) {
		error(e)
	}
	return ''
}
export async function asyncGetValidate (value, rule, values) {
	value = value || ''
	try {
		for (const key in rule) {
			const error = await getValidateError[key](value, rule[key], values)

			if (error) {
				return error
			}
		}
	} catch (e) {
		error(e)
	}
	return ''
}
