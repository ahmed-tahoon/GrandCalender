import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import LoadingIcon from 'components/buttons/LoadingIcon';

export default function CalendarUrlField(props) {
    const { label, helpText, prefix, input, meta, placeholder = null, col = 3, required = false, serverError = null } = props

    return (
        <div dir="ltr" className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className={ (meta.error && meta.touched) ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 mt-1 relative flex rounded-md shadow-sm' : 'mt-1 relative flex rounded-md shadow-sm'}>
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                {prefix}
                </span>
                <input
                    {...input}
                    type="text"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-grandkit-500 focus:ring-grandkit-500 sm:text-sm"
                />

                {meta.validating && meta.active && <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                    <LoadingIcon loading={true} color="grandkit-600" />
                </div>}
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />

                </div>}
            </div>
            {helpText && <p className="mt-2 text-sm text-gray-500" id="email-description">{helpText}</p>}
            {meta.error && meta.dirty && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
            {serverError && serverError[input.name] && <div className="mt-2 text-sm text-red-800">{serverError[input.name][0]}</div>}
        </div>
    )
}
