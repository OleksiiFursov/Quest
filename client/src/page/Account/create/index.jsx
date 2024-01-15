import AccountLoginForm from "./Form.jsx";
import H2 from "../../../components/Text/H2.jsx";
import {useEffect} from "preact/compat";

function AccountLoginPage() {
    useEffect(()=>{

    }, []);
    return (<div className="login-form-wrap">
        <H2>Sign in</H2>
        <AccountLoginForm/>
    </div>);
}

export default AccountLoginPage
