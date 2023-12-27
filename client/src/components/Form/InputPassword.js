import Input from "./input.jsx";
import {memo} from "preact/compat";

function InputPassword(props){
    const {name='password', value} = props;

    return <Input name={name} type="password" value={value} />
}

export const ValidatePassword = {
    require: true,
    min: 3,
    max: 40,
};

export default memo(InputPassword);