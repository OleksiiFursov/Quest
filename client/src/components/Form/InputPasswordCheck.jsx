import { Stack } from '@mui/joy'
import { passwordStrength } from 'check-password-strength'
import { memo } from 'preact/compat'
import InputPassword from './InputPassword.jsx'
import LinearProgress from '@mui/joy/LinearProgress';


function InputPasswordCheck (props) {
	const {value} = props;
	const passwordMeta =  passwordStrength(value);

	console.log(passwordMeta);

	return(    <Stack
	  spacing={0.5}
	  sx={{
		  '--hue': Math.min( 10, 120),
	  }}
	>
		<InputPassword {...props} after={
			<LinearProgress
			  determinate
			  size="sm"
			  value={(passwordMeta.id/4)*100}
			  sx={{
				  bgcolor: 'background.level3',
				  color: 'hsl(var(--hue) 80% 40%)',
			  }}
			/>
		}/>

	</Stack>)
}

export default memo(InputPasswordCheck)
