import Input from "./input.jsx";
import {memo} from "preact/compat";
import {Person} from "@mui/icons-material";

function InputLogin(props) {
    const {name = 'login', label = 'Login', value, error, ...rest} = props;
    return (<Input
        label={label}
        startDecorator={<Person/>}
        name={name}
        error={error}
        value={value}
        {...rest}
    />)
}

export const ValidateLogin = {
    require: true,
    min: 3,
    max: 40,
    pattern: [/^[a-zA-Z0-9_-]+$/, 'Login must contain A-Z, a-z, 0-9 and symbol _, - ']
};


export default memo(InputLogin);