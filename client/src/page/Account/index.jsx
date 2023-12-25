import Input from '../../components/form/input.jsx'

import useForm from '../../hooks/useForm.jsx'
import notification from "../../components/Notification/index.jsx";

const initial = {}

function AccountLoginPage () {
  const { Form, Submit, values, setValue } = useForm({
    initial,
    onSubmit (e) {

    },
  })


  return (<form onSubmit={async (e) => {
    e.preventDefault()
    const formData = {}
    const form = e.target.elements
    for (let i = 0; i < form.length; i++) {
      formData[form[i].name] = form[i].value
    }
    const [status, data] = await WSS.req('account.login', {
      username: form.username.value,
      password: form.password.value
    });
    if(status !== 200){
      notification.error(data);
    }else{
      notification.success(data);
    }

    // const a = Date.now();
    // const res = await WSS.req('account.login', formData);
    // //console.log(1, res);
    // console.log( res, Date.now() - a + ' ms');
    //
    //
    // const b = Date.now();
    // let gg = await fetch('http://localhost/');
    // gg = await gg.json();
    // console.log(gg, Date.now() - b + ' ms');
    //



  }}>
    <Input type="text" name="username" label="Login"/>
    <Input type="password" name="password"/>
    <Submit>Send</Submit>
  </form>)

}

export default AccountLoginPage
