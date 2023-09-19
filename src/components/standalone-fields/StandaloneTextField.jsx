import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export default function StandaloneTextField(props) {
    const { label, value = '', onChange, meta, placeholder = null, required = false } = props
    const [inputValue, setInputValue] = useState(value)

    function handleChange(ev) {
        onChange(ev.target.value)
        setInputValue(ev.target.value)
    }

    return (
        <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <input
                    value={inputValue}
                    onChange={handleChange}
                    type="text"
                    placeholder={placeholder}
                    className="shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
            </div>
        </div>
    )
}