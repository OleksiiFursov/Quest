import Input from "./input.jsx";
import {memo} from "preact/compat";
import {Key} from "@mui/icons-material";

function InputPassword(props) {
    const {name = 'password', label="Password", value, error} = props;

    return (<Input
        startDecorator={<Key/>}
        name={name}
        type="password"
        error={error}
        label={label}
        value={value}
    />)
}

export const ValidatePassword = {
    require: true,
    min: 3,
    max: 40,
};

export default memo(InputPassword);