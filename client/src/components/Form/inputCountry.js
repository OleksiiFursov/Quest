import { Select } from '@mui/joy'
import IntlTelInput from 'intl-tel-input/react/build/IntlTelInput.esm'
import { memo } from 'preact/compat'

function InputPhone (props) {
	return (
	  <Select>
		  <Option value="dog">Dog</Option>
		  <Option value="cat">Cat</Option>
		  <Option value="fish">Fish</Option>
		  <Option value="bird">Bird</Option>
	  </Select>
	)
}

export default memo(InputPhone)

// import 'react-select-country-flag'
// import Input from "./input.jsx";
// import {memo} from "preact/compat";
// import PhoneIcon from '@mui/icons-material/Phone';
//
// function InputPhone(props) {
// 	const {name = 'phone', label = __('Phone'), value, error, ...rest} = props;
//
// 	return (<Input
// 	  label={label}
// 	  startDecorator={<PhoneIcon/>}
// 	  name={name}
// 	  type="tel"
// 	  error={error}
// 	  value={value}
// 	  {...rest}
// 	/>)
// }
//
//
//
//
