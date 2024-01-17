import AccountCreateUser from "./Form.jsx";
import H2 from "../../../components/Text/H2.jsx";
import {useEffect} from "preact/compat";

function AccountLoginPage() {
    useEffect(()=>{

    }, []);
    return (<div className="account-create-form-wrap">
        <H2>{__('Create account')}</H2>
        <AccountCreateUser/>
    </div>);
}

export default AccountLoginPage
