import {useState} from "preact/hooks";
import {setObject} from "@crossfox/utils";

export default function useForm(props={}){
    const {initial = {}, onSubmit} = props;
    const [values, setValue] = useState(initial);

    console.log(setObject);
    return {
        values,
        setValue: e => setValue(prev => console.log(e, prev, setObject(prev)(e.target.name, e.target.value))),
        Form: ({children}) => <form onSubmit={e => {
            e.preventDefault();
            onSubmit && onSubmit(e, values);

        }}>{children}</form>,
        Submit: (props) => {
            const {children} = props;
            return <button {...props}>{children}</button>
        }

    }

}
