import { goTo, Link } from '@/core/Router/index.jsx'
import InputBirthday from '../../../components/Form/InputBirthday.jsx'
import InputGender from '../../../components/Form/InputGender.jsx'
import { crop } from '../../../helpers.js'
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
	name: 'accountCreate',
	onSubmit: async (values) => {
		const [status, data] = await api.send('account/create', crop(values,
		  ['username', 'password', 'birthday', 'gender']
		))
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
		<InputPassword value={values.password2} error={errors.password2} confirm/>
		<InputBirthday value={values.birthday} error={errors.birthday}/>
		<InputGender value={values.gender} error={errors.gender}/>
		<div className="flex-between">
			<span>{__('Have an account?')} <Link to="account/login">{__('Log in')}</Link></span>
			<Button {...SubmitProps} />
		</div>
	</form>

}

export default AccountLoginForm
