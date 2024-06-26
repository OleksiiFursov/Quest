import Input from "./input.jsx";
import {memo} from "preact/compat";
import {Person} from "@mui/icons-material";

function InputLogin(props) {
    const {name = 'email', label = __('Email'), value, error, ...rest} = props;

    return (<Input
        label={label}
        startDecorator={<Person/>}
        name={name}
        error={error}
        value={value}
        {...rest}
    />)
}

export default memo(InputLogin);
