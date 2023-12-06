import Input from "../../components/form/input.js";
import {useState} from "preact/hooks";
import useForm from "../../hooks/useForm.js";


function AccountLoginPage(){
    const {Form, Submit, values, setValue} = useForm({
        onSubmit(e){
            WSS.req('account.login', values, (a) => console.log(777, a))
        }
    });

    console.log(values);
    return (<Form>
        <Input type="text" name="login" label="Login" value={values.login} onChange={setValue}  />
        <Input type="password" name="password" value={values.password} onChange={setValue} />
        <Submit>Send</Submit>
    </Form>);

}
export default AccountLoginPage;