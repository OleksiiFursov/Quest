import { memo } from 'preact/compat'
import InputRadio from './InputRadio.jsx'

const GenderSelection = (props) => {
	const { error, value, label, className, ...rest } = props

	const options = {
		male: __('Male'),
		female: __('Female'),
		other: __('Other'),
	}

	return (
	  <InputRadio
		label={__('Gender')}
		name="gender"
		options={options}
		{...rest}
	  />
	)
}

export default memo(GenderSelection)
