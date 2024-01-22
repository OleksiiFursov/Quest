import { goTo, Link } from '@/core/Router/index.jsx'
import { crop } from '../../../helpers.js'
import useForm from '../../../hooks/useForm.jsx'
import InputLogin from '../../../components/Form/InputUsername.jsx'
import InputPassword from '../../../components/Form/InputPassword.jsx'
import Button from '../../../components/Form/Button.jsx'
import notification from '../../../components/Notification/index.jsx'
import api from '../../../core/Api/index.js'
import { store } from '@/main.jsx'
import Storage from '@/core/Storage/index.js'
import { setCurrentUser } from '@/app/actions.js'

const propsForm = {
	name: 'accountLogin',
	onSubmit: async (values) => {

		const [status, data] = await api.send('account/login', crop(values, ['username', 'password']))
		if (status === 200) {
			Storage.set('token', data.token)
			store.dispatch(setCurrentUser(data))
			goTo('main')
		} else {
			notification.error(data)
		}
	},
}

function AccountLoginForm () {
	const { FormProps, values, errors, SubmitProps } = useForm(propsForm);

	return <form {...FormProps}>
		<InputLogin value={values.username} error={errors.username} autofocus/>
		<InputPassword value={values.password} error={errors.password}/>
		<div className="flex-between">
			<Link to="account/create">{__('Create account')}</Link>
			<div className="flex-gap-1">
				<Link to="account/reset">{__('Remind password')}</Link>
				<Button {...SubmitProps} />
			</div>
		</div>
	</form>

}

export default AccountLoginForm
