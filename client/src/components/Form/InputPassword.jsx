import Input from './input.jsx'
import { memo } from 'preact/compat'
import { Key } from '@mui/icons-material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useState } from 'preact/hooks'

function InputPassword (props) {
	const { name = 'password', label = __('Password'), value, error, confirm} = props
	const [see, setSee] = useState(false)
	const eyeProps = {
		onClick: () => setSee(v => !v),
		className: 'cpt',
	}

	return (<Input
	  startDecorator={<Key/>}
	  name={name + (confirm?'2':'')}
	  type={see ? 'text' : 'password'}
	  error={error}
	  label={label}
	  value={value}
	  endDecorator={see ? <VisibilityOffIcon {...eyeProps}/> :
		<VisibilityIcon {...eyeProps}/>}
	/>)
}

export default memo(InputPassword)
