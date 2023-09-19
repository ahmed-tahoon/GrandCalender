import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import Datepicker from "react-tailwindcss-datepicker";

const notificationMethods = [
    { id: 'email', title: 'Email' },
    { id: 'sms', title: 'Phone (SMS)' },
    { id: 'push', title: 'Push notification' },
  ]

export default function InviteesScheduleField(props) {
    const { label, input, meta, placeholder = '', col = 3, required = false, serverError = null } = props

    const [value, setValue] = useState(input.value ? input.value : {
        type: 3,
        into_the_future_days: 30,
        into_the_future_type: 'business_days',
        date_range: {
            startDate: undefined,
            endDate: undefined
        },
    })

    const handleDateRangeChange = (newValue) => {
        setValue({...value, date_range: newValue});
        input.onChange({...value, date_range: newValue})
    }

    const onChangeIntoTheFutureType = (ev) => {
        setValue({...value, into_the_future_type: ev.target.value});
        input.onChange({...value, into_the_future_type: ev.target.value})
    }

    const onChangeIntoTheFutureDays = (ev) => {
        setValue({...value, into_the_future_days: ev.target.value});
        input.onChange({...value, into_the_future_days: ev.target.value})
    }

    function onChangeType(ev) {
        setValue({...value, type: parseInt(ev.target.value)})
        input.onChange({...value, type: parseInt(ev.target.value)})
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 relative">
                <fieldset className="mt-2">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id={input.name+'3'}
                                name={input.name+'3'}
                                type="radio"
                                value="3"
                                checked={value.type === 3}
                                onChange={onChangeType}
                                className="h-4 w-4 border-gray-300 text-grandkit-600 focus:ring-grandkit-600"
                            />
                            <div className="ml-3 rtl:mr-3 block text-sm font-medium leading-6 text-gray-900">
                            Indefinitely into the future
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                id={input.name+'1'}
                                name={input.name+'1'}
                                type="radio"
                                value="1"
                                checked={value.type === 1}
                                onChange={onChangeType}
                                className="h-4 w-4 border-gray-300 text-grandkit-600 focus:ring-grandkit-600"
                            />
                            <div className="ml-3 rtl:mr-3 space-s-2 text-sm font-medium leading-6 text-gray-900 flex justify-start items-center">
                                <input
                                    type="number"
                                    className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grandkit-600 sm:text-sm sm:leading-6"
                                    value={value.into_the_future_days}
                                    onChange={onChangeIntoTheFutureDays}
                                />
                                {/* <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-grandkit-600 sm:text-sm sm:leading-6"
                                    value={value.into_the_future_type}
                                    onChange={onChangeIntoTheFutureType}
                                >
                                    <option value="business_days">business days</option>
                                    <option value="calendar_days">calendar days</option>
                                </select> */}
                                <div className="whitespace-nowrap">day(s) in to the future</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                id={input.name+'2'}
                                name={input.name+'2'}
                                type="radio"
                                value="2"
                                checked={value.type === 2}
                                onChange={onChangeType}
                                className="h-4 w-4 border-gray-300 text-grandkit-600 focus:ring-grandkit-600"
                            />
                            <div className="ml-3 rtl:mr-3 space-s-2 text-sm font-medium leading-6 text-gray-900 flex justify-start items-center">
                                <div className="whitespace-nowrap">Within a date range</div>
                                <Datepicker
                                    value={value.date_range}
                                    onChange={handleDateRangeChange}
                                    showShortcuts={true}
                                    primaryColor={"fuchsia"}
                                    inputClassName="py-1.5 border-0 rounded-md text-gray-900 ring-1 ring-inset focus:ring-grandkit-600 shadow-sm ring-gray-300 focus:ring-2 focus:border-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
            {serverError && serverError[input.name] && <div className="mt-2 text-sm text-red-800">{serverError[input.name][0]}</div>}
        </div>
    )
}
