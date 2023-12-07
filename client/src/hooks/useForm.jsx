import { useCallback, useState } from 'preact/hooks'
import {setObject} from "@crossfox/utils";

export default function useForm(props={}){
    const {initial = {}, onSubmit} = props;
    const [values, setValue] = useState(initial);

    const set = useCallback(prev => setValue, []);


    return {
        values,
        setValue: e => set(prev => setObject(prev)(e.target.name, e.target.value)),
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
