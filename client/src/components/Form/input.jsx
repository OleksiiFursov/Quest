import {memo} from "preact/compat";
import {classNames} from "@crossfox/utils";
import {FormControl, FormHelperText, FormLabel, Input as _Input} from "@mui/joy";


function Input(props) {
    const {error, label, autoFocus, className, ...rest} = props;

    if(autoFocus){
        rest.slotProps = {
            input: {
                autoFocus: true,
            }
        }
    }
    return (<FormControl error={!!error}>
        <FormLabel>{label}</FormLabel>
        <_Input
          className={classNames(error && 'input-error', className)}
          sx={{
              '&::before': {
                  border: '1.5px solid var(--Input-focusedHighlight)',
                  transform: 'scaleX(0)',
                  left: '2.5px',
                  right: '2.5px',
                  bottom: 0,
                  top: 'unset',
                  transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                  borderRadius: 0,
                  borderBottomLeftRadius: '64px 20px',
                  borderBottomRightRadius: '64px 20px',
              },
              '&:focus-within::before': {
                  transform: 'scaleX(1)',
              },
          }}
          {...rest}/>
        <FormHelperText dangerouslySetInnerHTML={{__html: error || '&nbsp;'}} />
    </FormControl>);

}

export default memo(Input);
