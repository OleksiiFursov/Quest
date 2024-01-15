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
		const [call, msg] = validWithMsg(obj, __('Field is not correct'))
		return call(value, values) && msg
	},
}

export default function getValidate (value, rule, values) {
	value = value || ''
	for (const key in rule) {
		const error = getValidateError[key](value, rule[key], values)
		if (error) {
			return error
		}
	}
	return ''
}
