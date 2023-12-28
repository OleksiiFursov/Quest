import AccountLoginForm from "./Form.js";
import H2 from "../../components/Text/H2.js";

function AccountLoginPage() {
    return (<div className="login-form-wrap">
        <H2>Sign in</H2>
        <AccountLoginForm/>
    </div>);
}

export default AccountLoginPage
