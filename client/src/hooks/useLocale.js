import { asyncFetch } from '../helpers.js'
let prev = null

export async function useGetLocale (force = false) {
	return !force && !prev ? prev = await asyncFetch('https://ipapi.co/json') : prev

}


