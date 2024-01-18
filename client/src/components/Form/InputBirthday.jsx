import Input from './input.jsx'
import { memo } from 'preact/compat'
import { Person } from '@mui/icons-material'
import InputDate from './InputDate.js'

function InputBirthday (props) {
	const { name = 'birthday', label = __('Birthday'), value, error, ...rest } = props
	return (<InputDate
	  name={name}
      label={label}
      value={value}
      erorr={error}
      {...rest}
	/>)
}

export default memo(InputBirthday)
