import { memo } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import {setObject} from "@crossfox/utils";

const Form = memo(({children}) => <form>{children}</form>);

export default function useForm(props={}){
    const {initial = {}, onSubmit} = props;
    const [values, setValue] = useState(initial);

    const set = useCallback(setValue, []);

    const onSubmitHandler = e => {
        e.preventDefault();
        onSubmit && onSubmit(e, values);
    }

    return {
        values,
        setValue: e => set(prev => setObject(prev)(e.target.name, e.target.value)),
        Form,
        Submit: (props) => {
            const {children} = props;
            return <button {...props}>{children}</button>
        }

    }

}
