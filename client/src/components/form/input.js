import {memo} from "preact/compat";

function Input(props){

    return <label><input {...props}/></label>;

}

export default memo(Input);