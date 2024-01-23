import dayjs from 'dayjs'
import { memo } from 'preact/compat'
import { theDate } from '../../core/Format/index.js'
import Input from './input.jsx'


function InputDate(props){
	const { name = 'birthday', label = __('Birthday'), value, error, ...rest } = props
	return  <Input
	  type="date"
	  name={name}
	  label={label}
	  error={error}
	  value={value}
	  {...rest}
	/>

}

export default memo(InputDate)
