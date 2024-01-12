export const username = {
	require: true,
	min: 3,
	max: 40,
	pattern: ['^[a-zA-Z0-9_-]+$', 'Login must contain A-Z, a-z, 0-9 and symbol _, - '],
}

export const password = {
	require: true,
	min: 3,
	max: 40,
}
