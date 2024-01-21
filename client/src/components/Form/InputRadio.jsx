import { memo } from 'preact/compat'
import { classNames } from '@crossfox/utils'
import {
	FormControl,
	FormHelperText,
	FormLabel,
	Radio,
	RadioGroup,
} from '@mui/joy'

function InputRadio (props) {
	const { error, value, orientation="horizontal", options = {}, label, className, ...rest } = props
	return (
	  <FormControl error={!!error}>
		  <FormLabel>{label}</FormLabel>
		  <RadioGroup
			className={classNames(error && 'input-error', className)}
			name={name}
			value={value}
			orientation={orientation}
			{...rest}
		  >
			  {Object.entries(options).map(([key, label]) => (
				<Radio
				  key={key}
				  value={key}
				  label={label}
				/>
			  ))}

		  </RadioGroup>

		  <FormHelperText>{error || ''}&nbsp;</FormHelperText>
	  </FormControl>)

}

export default memo(InputRadio)
