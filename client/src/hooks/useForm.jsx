import { useCallback, useEffect } from 'preact/compat'
import { useRef, useState } from 'preact/hooks'
import { formValid } from '../components/Form/LoaderValid.js'
import getValidate from '../components/Form/ValidForm.js'
import { debounce, isDiff, setState } from '../helpers.js'
import { Session } from '../core/Storage/index.js'

export default function useForm (props = {}) {
	const { initial = {}, onSubmit } = props
	const nameForm = props.name || ''

	const validate = formValid[nameForm] || {};

	const [values, setValue] = useState(initial)
	const [errors, setErrors] = useState({})
	const touched = useRef({})
	const isCheck = useRef(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const saveData = Session.get('form-' + nameForm)

		if (saveData && isDiff(saveData, values)) {
			setValue(saveData)
		}

	}, [])

	const getIsValid = () => {
		for (const key in validate) {
			const error = errors[key]
			if (error === undefined) {
				if (!touched.current[key]) {
					const errorMsg = getValidate(values[key], validate[key])
					if (errorMsg) return false
					setErrors(setState(key, errorMsg))
				}
			} else if (error.length) {
				return false
			}
		}
		return true
	}

	const FormProps = {
		onInput: (e) => {
			const { name, value } = e.target
			touched.current[name] = true

			if (validate[name]) {
				debounce(()=>{
					const error = getValidate(value, validate[name])

					if (errors[name] !== error) {
						setErrors(setState(name, error))
					}
				})()

			}

			setValue(() => setState(name, value)(values))
			if (nameForm) {
				Session.set('form-' + nameForm, values)
			}
		},
		onSubmit: async (e) => {
			e.preventDefault()
			const errs = {}
			for (const key in validate) {
				const error = getValidate(values[key], validate[key])
				if (error)
					errors[key] = error
			}

			if (Object.keys(errs).length) {
				if (isDiff(errs, errors)) {
					setErrors(errs)
				}
				return 0
			} else {
				setLoading(true)
				onSubmit && await onSubmit(values, e)
				setLoading(false)
			}

		},
	}

	const isValid = getIsValid()
	const SubmitProps = {
		disabled: !isValid || loading,
		type: 'submit',
		loading,
		onMouseOver: () => {
			if (isCheck.current) return
			const errs = {}
			for (const key in validate) {
				errs[key] = getValidate(values[key], validate[key])
			}
			if (isDiff(errors, errs))
				setErrors(errors)

			isCheck.current = true
		},
	}

	return {
		FormProps,
		SubmitProps,
		values,
		errors,
		isValid,
		setLoading: useCallback(setLoading, []),
		loading,
		setValue: (name, value, isValid = true) => {
			if (isValid) {
				setErrors(setState(name, getValidate(value, validate[name])))
			}

			setValue(setState(name, value))
		},

	}
}
