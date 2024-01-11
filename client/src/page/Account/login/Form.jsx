import Captcha, { getCaptchaToken } from '../../../components/Form/Captcha.js'
import useEventSocket from '../../../hooks/useEventSocket.js'
import useForm from '../../../hooks/useForm.jsx'
import InputLogin  from '../../../components/Form/InputLogin.jsx'
import InputPassword  from '../../../components/Form/InputPassword.jsx'
import Button from '../../../components/Form/Button.jsx'
import notification from '../../../components/Notification/index.jsx'
import api from '../../../core/Api/index.js'

const propsForm = {
	name: 'login',
	onSubmit: async (values) => {
		const captcha = await getCaptchaToken()
		const [status, data] = await api.send('account/login', {
			username: values.login,
			password: values.password,
			captcha
		})
		if (status !== 200) {
			notification.error(data)
		} else {
			//
		}
	},
}

function AccountLoginForm () {
	const { FormProps, values, errors, SubmitProps} = useForm(propsForm)
	return <form {...FormProps}>
		<InputLogin value={values.login} error={errors.login} autoComplete="off"/>
		<InputPassword value={values.password} error={errors.password}/>
		<Button {...SubmitProps}>Submit</Button>
	</form>

}

export default AccountLoginForm
