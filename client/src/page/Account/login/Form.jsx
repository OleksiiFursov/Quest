import Captcha from '../../../components/Form/Captcha.js'
import useEventSocket from '../../../hooks/useEventSocket.js'
import useForm from '../../../hooks/useForm.jsx'
import InputLogin, { ValidateLogin } from '../../../components/Form/InputLogin.jsx'
import InputPassword, { ValidatePassword } from '../../../components/Form/InputPassword.jsx'
import Button from '../../../components/Form/Button.jsx'
import notification from '../../../components/Notification/index.jsx'
import api from '../../../core/Api/index.js'

const propsForm = {
	name: 'login',
	validate: {
		login: ValidateLogin,
		password: ValidatePassword,
	},
	onSubmit: async (values) => {

		const [status, data] = await api.send('account/login', {
			username: values.login,
			password: values.password,
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
	useEventSocket('login.enableCaptcha', status => {

	});

	return <form {...FormProps}>
		<InputLogin value={values.login} error={errors.login} autoComplete="off"/>
		<InputPassword value={values.password} error={errors.password}/>
		<Captcha />
		<Button {...SubmitProps}>Submit</Button>
	</form>

}

export default AccountLoginForm
