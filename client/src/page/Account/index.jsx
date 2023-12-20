import Input from '../../components/form/input.jsx'

import useForm from '../../hooks/useForm.jsx'

const initial = {}

function AccountLoginPage () {
  const { Form, Submit, values, setValue } = useForm({
    initial,
    onSubmit (e) {

    },
  })

  console.log(123)

  return (<form onSubmit={(e) => {
    e.preventDefault()
    const formData = {}
    const form = e.target.elements
    for (let i = 0; i < form.length; i++) {
      formData[form[i].name] = form[i].value
    }
    WSS.req('account.login', formData,)
  }}>
    <Input type="text" name="login" label="Login"/>
    <Input type="password" name="password"/>
    <Submit>Send</Submit>
  </form>)

}

export default AccountLoginPage
