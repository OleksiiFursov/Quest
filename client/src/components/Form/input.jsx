import {memo} from "preact/compat";



function Input(props){
    const {error} = props;
    return <label>
        <input {...props}/>
        <div className="input-error">{error || ' '}</div>
    </label>;

}

export default memo(Input);