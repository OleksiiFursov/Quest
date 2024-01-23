import Input from "./input.jsx";
import {memo} from "preact/compat";
import {AlternateEmail} from "@mui/icons-material";

function InputEmail(props) {
    const {name = 'email', label = __('Email'), value, error, ...rest} = props;

    return (<Input
        label={label}
        startDecorator={<AlternateEmail/>}
        name={name}
        error={error}
        value={value}
        type="email"
        {...rest}
    />)
}

export default memo(InputEmail);
