const validWithMsg = (valid, msg) => {
	if (Array.isArray(valid)) return valid
	return [valid, msg]
}

const getValidateError = {
	require (value, obj) {
		const [, msg] = validWithMsg(obj, __('Field is empty'))
		return value === '' ? msg : false
	},
	pattern (value, obj) {
		const [reg, msg] = validWithMsg(obj, __('Field is not correct'))
		return !RegExp(reg).test(value) ? msg : false
	},
	min (value, obj) {
		const [min, msg] = validWithMsg(obj, __('Field is too short'))
		return value.length < min ? msg : false
	},
	max (value, obj) {
		const [max, msg] = validWithMsg(obj, __('Field is too long'))
		return value.length > max ? msg : false
	},
}

export default function getValidate (value, rule) {
	value = value || ''
	for (const key in rule) {
		const error = getValidateError[key](value, rule[key])
		if (error) {
			return error
		}
	}
	return ''
}
