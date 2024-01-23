import dayjs from 'dayjs'

export const username = {
	require: true,
	min: 3,
	max: 40,
	pattern: [/^[a-zA-Z0-9_-]+$/, __('Login must contain A-Z, a-z, 0-9 and symbol _, - ')],
}

export const password = {
	require: true,
	min: 3,
	max: 40,
}

export const password2 = {
	require: true,
	check: [(value, values) => value === values.password, __('Passwords do not match')],
}

export const fullName = {
	min: 3,
	max: 120,
	placeholder: __('Please provide your real name'),
}

export const birthday = {
	require: true,
	check: [value => {
		const d = dayjs().diff(dayjs(value), 'year')
		return d >= -100 && d <= 0
	}, __('')],
}

export const gender = {
	require: true,
	pattern: [/^[012]$/, __('Login must contain A-Z, a-z, 0-9 and symbol _, - ')],
}
export const email = {
	require: true,
	min: 3,
	max: 120,
	pattern: [/^\S+@\S+\.\S{2,}$/, __('Invalid email address')],
}

export const phone = {
	require: true,
	//pattern: [/^[012]$/, __('Login must contain A-Z, a-z, 0-9 and symbol _, - ')],
}
