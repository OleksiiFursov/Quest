import {useEffect, useMemo} from 'preact/compat'
import {useRef, useState} from 'preact/hooks'
import {parseJSON, setObject} from "@crossfox/utils";
import {setState} from "../helpers.js";
import {Session} from "../core/Storage/index.js";


const validWithMsg = (valid, msg) => {
    if (Array.isArray(valid)) return valid;
    return [valid, msg];
}

const getValidateError = {
    require(value, obj){
        const [, msg] = validWithMsg(obj, 'Field is empty');
        return value === '' ? msg: false;
    },
    pattern(value, obj){
        const [reg, msg] = validWithMsg(obj, 'Field is not correct');
        return !reg.test(value) ? msg: false
    },
    min(value, obj){
        const [min, msg] = validWithMsg(obj, 'Field is too short');
        return value.length < min ? msg: false
    },
    max(value, obj){
        const [max, msg] = validWithMsg(obj, 'Field is too long');
        return  value.length > max ? msg: false
    }
}
function getValidate(value, rule) {
    for(const key in rule){
        const error = getValidateError[key](value, rule[key]);
        if(error){
            return error
        }
    }
    return '';
}

export default function useForm(props = {}) {
    const {initial = {}, onSubmit, validate = {}} = props;
    const nameForm = props.name || '';
    const [values, setValue] = useState(initial);
    const [errors, setErrors] = useState({});
    const touched = useRef({});
    const onStartCorrect = useRef(false);
    const isCheck = useRef(false);


    useEffect(() => {
        const saveData = Session.get('form-' + name);

        if (saveData) {
            setValue(saveData);
        }

    }, []);

    const FormProps = {
        onInput: (e) => {
            if (nameForm && sessionStorage) {
                sessionStorage.setItem('form-' + nameForm, JSON.stringify(values));
            }

            const {name, value} = e.target;
            touched.current[name] = true;

            if (validate[name]) {
                const error = getValidate(value, validate[name]);
                console.log(name, error, errors, validate[name])

                if (errors[name] !== error) {
                    setErrors(setState(name, error));
                }
            }

            setValue(setState(name, value));
        },
        onSubmit: (e) => {
            e.preventDefault();
            console.log('submit');
            onSubmit && onSubmit(values, e);
        }
    };

    const isValid = Object.keys(touched.current).length && !Object.values(errors).filter(v => v).length

    const SubmitProps = {
        disabled: !isValid,
        onMouseOver: () => {
            if (isCheck.current) return;
            const errors = {};
            console.log(values);
            for (const key in validate) {
                errors[key] = getValidate(values[key] || '', validate[key]);
            }
            setErrors(errors);
            isCheck.current = true;
        }
    }

    return {
        FormProps,
        SubmitProps,
        values,
        errors,
        isValid

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
