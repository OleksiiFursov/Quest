import {useEffect, useMemo} from 'preact/compat'
import {useRef, useState} from 'preact/hooks'
import {parseJSON, setObject} from "@crossfox/utils";


const validWithMsg = (valid, msg) => {
    if (Array.isArray(valid)) return valid;
    return [valid, msg];
}

function getValidate(value, name, rule) {
    const error = {};


    if (rule.require && value === '') {
        const [, msg] = validWithMsg(null, 'Field is empty');
        error[name] = msg;
    } else if (rule.pattern) {
        const [reg, msg] = validWithMsg(rule.pattern, 'Field is not correct');
        if (!reg.test(value)) {
            error[name] = msg;
        } else if (rule.min && value.length < rule.min) {
            const [, minMsg] = validWithMsg(null, 'Field is too short');
            error[name] = minMsg;
        } else if (rule.max && value.length > rule.max) {
            const [, maxMsg] = validWithMsg(null, 'Field is too long');
            error[name] = maxMsg;
        } else {
            error[name] = '';
        }
    }

    return error;

}

export default function useForm(props = {}) {
    const {initial, onSubmit, validate = {}} = props;
    const nameForm = props.name || '';
    const [values, setValue] = useState(initial);
    const [errors, setErrors] = useState({});
    const onStartCorrect = useRef(false);


    useEffect(() => {
        if (sessionStorage && sessionStorage['form-' + name]) {
            setValue(parseJSON(sessionStorage['form-' + name]));
        }

    }, []);
    const FormProps = useMemo(() => ({
            onInput: (e) => {
                if (nameForm && sessionStorage) {
                    sessionStorage.setItem('form-' + nameForm, JSON.stringify(values));
                }

                const {name, value} = e.target;


                if(validate[name]){
                    const error = getValidate(value, name, validate[name]);
                    if (JSON.stringify(errors) !== JSON.stringify(error)) {
                        setErrors(error);
                    }
                }

                setValue(prev => setObject(prev)(name, value));
            },
            onSubmit: (e) => {
                e.preventDefault();
                onSubmit && onSubmit(e, values);
            }
        }), []
    );

    return {
        FormProps,
        values,
        errors,
        isValid: !Object.values(errors).filter(v => v).length

    }
}
// export default function useForm(props={}){
//     const {initial = {}, onSubmit} = props;
//     const [values, setValue] = useState(initial);
//
//     const set = useCallback(setValue, []);
//
//     const onSubmitHandler = e => {
//         e.preventDefault();
//         onSubmit && onSubmit(e, values);
//     }
//
//     return {
//         values,
//         setValue: e => set(prev => setObject(prev)(e.target.name, e.target.value)),
//         Form,
//         Submit: (props) => {
//             const {children} = props;
//             return <button {...props}>{children}</button>
//         }
//
//     }
//
// }
