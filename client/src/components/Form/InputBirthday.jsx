import dayjs from 'dayjs'
import { theDate } from '../../core/Format/index.js'
import { memo } from 'preact/compat'
import InputDate from './InputDate.jsx'

function InputBirthday (props) {
	const { name = 'birthday', label = __('Birthday'), value, error, ...rest } = props
	return (<InputDate
	  name={name}
      label={label}
      value={value}
      erorr={error}
	  slotProps={{
		  input: {
			  min: theDate(dayjs().subtract(100, 'year')),
			  max: theDate(),
		  },
	  }}
      {...rest}
	/>)
}

export default memo(InputBirthday)
