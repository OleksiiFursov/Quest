import { maskValue } from '../../helpers.js'
import Input from "./input.jsx";
import {memo} from "preact/compat";
import PhoneIcon from '@mui/icons-material/Phone';

function InputPhone(props) {
    const {name = 'phone', label = __('Phone'), value, error, ...rest} = props;

    rest.onChange = (e) => {
        e.target.value = maskValue(e.target.value, '+XXX-XXX-XXX-XXX')//.replace(/[^0-9]+/g, '')
        rest.onChange(e);
    }
    return (<Input
        label={label}
        startDecorator={<PhoneIcon/>}
        name={name}
        type="tel"
        error={error}
        value={value}
        {...rest}
    />)
}

export default memo(InputPhone);
