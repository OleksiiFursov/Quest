import Input from "../../components/form/input.js";

import useForm from "../../hooks/useForm.jsx";


function AccountLoginPage(){
    const {Form, Submit, values, setValue} = useForm({
        onSubmit(e, a){
            console.log(values, e, a);
            WSS.req('account.login', values, (a) => console.log(777, a))
        }
    });


    return (<Form>
        <Input type="text" name="login" label="Login" value={values.login} onChange={setValue}  />
        <Input type="password" name="password" value={values.password} onChange={setValue} />
        <Submit>Send</Submit>
    </Form>);

}
export default AccountLoginPage;
