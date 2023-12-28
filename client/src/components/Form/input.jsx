import {memo} from "preact/compat";
import {classNames} from "@crossfox/utils";
import {FormControl, FormHelperText, FormLabel, Input as _Input} from "@mui/joy";


function Input(props){
    const {error, label, className, ...rest} = props;
    return <FormControl>
        <FormLabel>{label}</FormLabel>
        <_Input className={classNames(error && 'input-error', className)} {...rest}/>
        <FormHelperText>{error || ' '}</FormHelperText>
    </FormControl>;

}

export default memo(Input);