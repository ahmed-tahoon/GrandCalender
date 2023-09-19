import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

export default function SingleFileUploadField(props) {
    const { label, input, meta, placeholder = null, col = 3, accept = "", required = false } = props

    const changeHandler = (event) => {
		input.onChange(event.target.files[0])
        console.log(event.target.files[0])
	};

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-800">*</span>} {input.value ? (<a rel="nofollow" href={input.value} target="_blank" className="inline-flex items-center px-2.5 py-1 ml-2 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View
                </a>) : ''}
            </label>

            {accept && <p className="mt-1 text-xs text-gray-500 italic">Accept: {accept}</p>}

            <div className="mt-2 relative">
                <input
                    name={input.name}
                    id={input.id}
                    onChange={changeHandler}
                    type="file"
                    placeholder={placeholder}
                    accept={accept}
                    className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm' : 'block w-full sm:text-sm border-gray-300'}
                />

                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}