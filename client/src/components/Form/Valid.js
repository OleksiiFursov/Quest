import api from '../../core/Api/index.js'

export const formValid = {}

export default async function loadFormValid () {
	const [status, data] = await api.get('main/formValid');
	console.log(status, data);

}
