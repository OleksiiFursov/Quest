import { goTo, Link } from '@/core/Router/index.jsx'
import InputEmail from '../../../components/Form/InputEmail.jsx'
import { crop } from '../../../helpers.js'
import useForm from '../../../hooks/useForm.jsx'
import InputPassword from '../../../components/Form/InputPassword.jsx'
import Button from '../../../components/Form/Button.jsx'
import notification from '../../../components/Notification/index.jsx'
import api from '../../../core/Api/index.js'
import { dispatch } from '@/main.jsx'
import Storage from '@/core/Storage/index.js'
import { setCurrentUser } from '@/app/actions.js'

const propsForm = {
	name: 'accountLogin',
	onSubmit: async (values) => {
		const [status, data] = await api.send('account/login', crop(values, ['email', 'password']))
		if (status === 200) {
			Storage.set('token', data.token)
			dispatch(setCurrentUser(data))
			goTo('main')
		} else {
			notification.error(data)
		}
	},
}

function AccountLoginForm () {
	const { FormProps, values, errors, SubmitProps } = useForm(propsForm);

	return <form {...FormProps}>
		<InputEmail value={values.email} error={errors.email} autoFocus/>
		<InputPassword value={values.password} error={errors.password}/>
		<div className="flex-between">
			<Link to="account/create">{__('Create account')}</Link>
			<div className="flex-gap-1">
				<Link to="account/reset">{__('Forgot password')}</Link>
				<Button {...SubmitProps} />
			</div>
		</div>
	</form>

}

export default AccountLoginForm
