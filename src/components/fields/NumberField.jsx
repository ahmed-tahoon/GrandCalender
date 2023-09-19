import { useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

export default function NumberField(props) {
    const { label, helpText, description = null, input, meta, col = 3, required = false, percentage = false, min = '', max = '',  unit = '', pluralUnit = '', serverError = null} = props
    const [inputValue, setInputValue] = useState(input.value)
    function handleChange(event) {
        let value = event.target.value
        if(percentage) {
            if(parseInt(value) < 0) {
                value = 0
            }
            if(parseInt(value) > 100) {
                value = 100
            }
        }
        if(max) {
            if(parseInt(value) > parseInt(max)) {
                value = max
            }
        }
        if(min) {
            if(parseInt(value) < parseInt(min)) {
                value = min
            }
        }
        setInputValue(value)
        input.onChange(value)
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>

            {description && <p className="mt-1 text-xs text-gray-500 italic">{description}</p>}

            <div className="mt-1 relative rounded-md shadow-sm">
                <input
                    {...input}
                    value={inputValue}
                    onChange={(event) => handleChange(event)}
                    type="number"
                    min={percentage ? '0' : min}
                    max={percentage ? '100' : max}
                    className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md' : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                />
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}

                {unit && <div className="absolute inset-y-0 right-8 flex top-2 pointer-events-none text-sm h-full text-gray-600">
                    {parseInt(inputValue) > 1 ? pluralUnit : unit}
                </div>}
            </div>
            {helpText && <p className="mt-2 text-sm text-right text-gray-500">{helpText}</p>}
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
            {serverError && serverError[input.name] && <div className="mt-2 text-sm text-red-800">{serverError[input.name][0]}</div>}
        </div>
    )
}
