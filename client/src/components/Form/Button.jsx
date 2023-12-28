import {memo} from "preact/compat";
import {default as _Button} from '@mui/joy/Button';
function Button(props){
    const {children, ...attr} = props;
    return <_Button {...attr}>{children}</_Button>
}
export default memo(Button)