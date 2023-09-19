import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import PasswordStrengthBar from 'react-password-strength-bar';

export default function PasswordField(props) {
    const { label, input, meta, placeholder = null, col = 3, required = false, strengthBarEnabled = false } = props

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 mb-1 relative rounded-md shadow-sm">
                <input
                    {...input}
                    type="password"
                    placeholder={placeholder}
                    className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                />
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
            {strengthBarEnabled && <PasswordStrengthBar password={input.value} />}
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}