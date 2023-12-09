import Input from "../../components/form/input.jsx";

import useForm from "../../hooks/useForm.jsx";

const initial = {};
function AccountLoginPage(){
    const {Form, Submit, values, setValue} = useForm({
        initial,
        onSubmit(e){
            console.log(11, values);
            WSS.req('account.login', values, (a) => console.log(777, a))
        }
    });

    console.log(123);


    return (<Form>
        <Input type="text" name="login" label="Login" />
        <Input type="password" name="password" />
        <Submit>Send</Submit>
    </Form>);

}
export default AccountLoginPage;
