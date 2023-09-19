import { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import axios from 'axios';

// Axios
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
axios.defaults.withCredentials = true

export default function InviteesField(props) {
    const { createPath, createParams, label, description = null, input, meta, col = 3, required = false, serverError = null } = props
    const [options, setOptions] = useState(input.value ? input.value : [])
    const [selectedItems, setSelectedItems] = useState(input.value)


    function handleChange(value) {
        setSelectedItems(value)
        input.onChange(value)
    }

    function isEmail(value) {
        if(!value) {
            return false
        }

        if(!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            return false
        }

        return true
    }

    function handleCreate(inputValue) {
        if(isEmail(inputValue)) {
            setSelectedItems([...selectedItems, {value: inputValue, label: inputValue}]);
            input.onChange([...selectedItems, {value: inputValue, label: inputValue}])
        }
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>

            {description && <p className="mt-1 text-xs italic text-gray-500">{description}</p>}

            <div className="mt-1 relative rounded-md shadow-sm">
                <CreatableSelect
                    isMulti
                    isClearable
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    options={options}
                    value={selectedItems}
                    className="basic-multi-select"
                    classNamePrefix="react-select"
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
