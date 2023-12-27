import useForm from '../../hooks/useForm.jsx'
import InputLogin, {ValidateLogin} from "../../components/Form/InputLogin.js";
import InputPassword, {ValidatePassword} from "../../components/Form/InputPassword.js";

const propsForm = {
    initial: {},
    name: 'login',
    validate: {
        login: ValidateLogin,
        password: ValidatePassword
    }
}

function AccountLoginPage() {
    const {FormProps, isValid, values, errors} = useForm(propsForm);

    console.log(isValid);
    return <form {...FormProps}>
        <InputLogin value={values.login} error={errors.login} />
        <InputPassword value={values.password} error={errors.password} />
        <button type="submit" disabled={isValid}>Submit</button>
    </form>

    // const { Form, Submit, values, setValue } = useForm({
    //   initial,
    //   onSubmit (e) {
    //
    //   },
    // })
    //
    //
    // return (<Form onSubmit={async (e) => {
    //   e.preventDefault()
    //   const formData = {}
    //   const Form = e.target.elements
    //   for (let i = 0; i < Form.length; i++) {
    //     formData[Form[i].name] = Form[i].value
    //   }
    //   const [status, data] = await WSS.req('account.login', {
    //     username: Form.username.value,
    //     password: Form.password.value
    //   });
    //   if(status !== 200){
    //     notification.error(data);
    //   }else{
    //     notification.success(data);
    //   }
    //
    //   // const a = Date.now();
    //   // const res = await WSS.req('account.login', formData);
    //   // //console.log(1, res);
    //   // console.log( res, Date.now() - a + ' ms');
    //   //
    //   //
    //   // const b = Date.now();
    //   // let gg = await fetch('http://localhost/');
    //   // gg = await gg.json();
    //   // console.log(gg, Date.now() - b + ' ms');
    //   //
    //
    //
    //
    // }}>
    //   <Input type="text" name="username" label="Login"/>
    //   <Input type="password" name="password"/>
    //   <Submit>Send</Submit>
    // </Form>)

}

export default AccountLoginPage
