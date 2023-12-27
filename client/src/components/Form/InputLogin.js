import Input from "./input.jsx";
import {memo} from "preact/compat";

function InputLogin(props) {
    const {name = 'login', value, error} = props;

    return <Input name={name} error={error} value={value}/>
}

export const ValidateLogin = {
    require: true,
    min: 3,
    max: 40,
    pattern: [/^[a-zA-Z0-9_-]+$/, 'Login must contain A-Z, a-z, 0-9 and symbol _, - ']
};

export default memo(InputLogin);