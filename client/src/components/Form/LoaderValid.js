import api from '../../core/Api/index.js'
import { setObjectPath } from '../../helpers.js'
import notification from '../Notification/index.jsx'

export let formValid = {}
export let formValidAfter = {}

export default async function loaderFormValid () {
	const [status, data] = await api.get('main/formValid')
	if (status === 200) {
		for (const [formName, formValue] of Object.entries(data)) {
			for (const [field, rules] of Object.entries(formValue)) {
				for (const [rule, value] of Object.entries(rules)) {
					setObjectPath(
					  rule.startsWith('after') ? formValidAfter : formValid, formName, field, rule, value,
					)
				}
			}
		}
	} else {
		console.error('Error loading form validation')
		notification.error(__('Some components failed to load. Please refresh the page. If the error persists, report it to the administration.'))
	}
}
