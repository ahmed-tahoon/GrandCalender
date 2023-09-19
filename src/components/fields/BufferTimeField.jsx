import { useState } from 'react'

export default function BufferTimeField(props) {
    const { label, description = '', input, meta, placeholder = '', col = 3, required = false, serverError = null } = props

    const [value, setValue] = useState(input.value ? input.value : {
        before: "",
        after: "",
    })

    function handleBeforeChange(ev) {
        setValue({...value, before: ev.target.value})
        input.onChange({...value, before: ev.target.value})
    }

    function handleAfterChange(ev) {
        setValue({...value, after: ev.target.value})
        input.onChange({...value, after: ev.target.value})
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>

            {description && <p className="mt-2 text-xs text-gray-500 italic">{description}</p>}

            <div className="mt-2 flex justify-start space-s-3">
                <div className="flex justify-between">
                    {/* <label htmlFor="location" className="block text-sm leading-6 text-gray-900">
                        Before event
                    </label> */}
                    <select
                        onChange={handleBeforeChange}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={value.before}
                    >
                        <option value="">Select buffer before event</option>
                        <option value="5">5 minutes before event</option>
                        <option value="10">10 minutes before event</option>
                        <option value="15">15 minutes before event</option>
                        <option value="20">20 minutes before event</option>
                        <option value="30">30 minutes before event</option>
                        <option value="45">45 minutes before event</option>
                        <option value="60">60 minutes before event</option>
                    </select>
                </div>
                <div>
                    {/* <label htmlFor="location" className="block text-sm leading-6 text-gray-900">
                        After event
                    </label> */}
                    <select
                        onChange={handleAfterChange}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={value.after}
                    >
                        <option value="">Select buffer after event</option>
                        <option value="5">5 minutes after event</option>
                        <option value="10">10 minutes after event</option>
                        <option value="15">15 minutes after event</option>
                        <option value="20">20 minutes after event</option>
                        <option value="30">30 minutes after event</option>
                        <option value="45">45 minutes after event</option>
                        <option value="60">60 minutes after event</option>
                    </select>
                </div>
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
            {serverError && serverError[input.name] && <div className="mt-2 text-sm text-red-800">{serverError[input.name][0]}</div>}
        </div>
    )
}
