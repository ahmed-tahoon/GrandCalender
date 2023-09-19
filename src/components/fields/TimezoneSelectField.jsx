import { useState } from 'react'
import TimezoneSelect from 'react-timezone-select'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function TimezoneSelectField(props) {
    const { label, input, meta, placeholder = null, col = 3, required = false } = props
    const [selectedTimezone, setSelectedTimezone] = useState(input.value ? input.value : {})

    function handleChange(value) {
        setSelectedTimezone(value)
        input.onChange(value.value)
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <TimezoneSelect
                    classNamePrefix="react-select"
                    value={selectedTimezone}
                    onChange={handleChange}
                />
                
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}