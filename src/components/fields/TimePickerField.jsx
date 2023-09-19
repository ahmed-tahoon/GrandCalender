import { useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import TimePicker from 'react-time-picker';

export default function TimePickerField(props) {
    const { label, input, meta, placeholder = null, col = 3, required = false } = props
    const [selectedTime, setSelectedTime] = useState(input.value)

    function handleChange(time) {
        setSelectedTime(time)
        input.onChange(time)
    }
    
    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>} {!required && <span className="text-gray-500">(optional)</span>}
            </label>
            <div className="mt-1 relative rounded-md">
                <TimePicker disableClock={true} onChange={handleChange} value={selectedTime}  className={ (meta.error && meta.touched) ? 'border inline-block pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'inline-block shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block sm:text-sm border first-letter:border-gray-300 rounded-md'} />
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}