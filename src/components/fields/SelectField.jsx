import { useState } from 'react'
import Select from 'react-select'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

export default function SelectField(props) {
    const { label, input, meta, placeholder = null, description = null, col = 3, options = [], required = false, isClearable = false, serverError = null } = props
    const updatedSelectedOption = (option) => {
        return option ? { label: option.name ? option.name : option.title, value: option.id, ...option } : {};
    }
    const [selectedOption, setSelectedOption] = useState(updatedSelectedOption(input.value))
    const updatedOptions = options.map((option) => ({
        label: option.name ? option.name : option.title,
        value: option.id,
        ...option
    }));

    function handleChange(value) {
        input.onChange(value)
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>

            {description && <p className="mt-1 text-xs text-gray-500 italic">{description}</p>}

            <div className="mt-1 relative rounded-md shadow-sm">
                <Select
                    onChange={handleChange}
                    defaultValue={selectedOption}
                    options={updatedOptions}
                    className="basic-multi-select"
                    classNamePrefix="react-select"
                    isClearable={isClearable}
                />
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
            {serverError && serverError[input.name] && <div className="mt-2 text-sm text-red-800">{serverError[input.name][0]}</div>}
        </div>
    )
}
