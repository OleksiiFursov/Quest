import { goTo } from '@/core/Router/index.jsx'
import useForm from '../../../hooks/useForm.jsx'
import InputLogin  from '../../../components/Form/InputUsername.jsx'
import InputPassword  from '../../../components/Form/InputPassword.jsx'
import Button from '../../../components/Form/Button.jsx'
import notification from '../../../components/Notification/index.jsx'
import api from '../../../core/Api/index.js'
import {store} from "@/main.jsx";
import Storage from "@/core/Storage/index.js";
import {setCurrentUser} from "@/app/actions.js";

const propsForm = {
	name: 'login',
	onSubmit: async (values) => {
		const [status, data] = await api.send('account/login', {
			username: values.username,
			password: values.password,
		})
		if (status === 200) {
			Storage.set('token', data.token);
			store.dispatch(setCurrentUser(data))
			goTo('main')
		} else {
			notification.error(data)
		}
	},
}

function AccountLoginForm () {
	const { FormProps, values, errors, SubmitProps} = useForm(propsForm)
	return <form {...FormProps}>
		<InputLogin value={values.username} error={errors.username} autoComplete="off"/>
		<InputPassword value={values.password} error={errors.password}/>
		<Button {...SubmitProps}>Submit</Button>
	</form>

}

export default AccountLoginForm
