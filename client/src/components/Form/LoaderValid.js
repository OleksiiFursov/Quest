import api from '../../core/Api/index.js'
import notification from '../Notification/index.jsx'

export let formValid = {}

export default async function loadFormValid () {
	const [status, data] = await api.get('main/formValid');
	if(status === 200){
		formValid = data;
	}else{
		console.error('Error loading form validation');
		notification.error(__('Some components failed to load. Please refresh the page. If the error persists, report it to the administration.'))
	}
}
