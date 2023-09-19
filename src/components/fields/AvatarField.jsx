import { ExclamationCircleIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { useRef, useState } from 'react';

export default function AvatarField(props) {
    const { label, input, meta, placeholder = null, col = 3, accept = "", required = false, user } = props
    const inputRef = useRef(null);
    const changeHandler = (event) => {
		input.onChange(event.target.files[0])
	};

    function remove() {
        input.onChange('remove');
        inputRef.current.value = "";
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                {label} {required && <span className="text-red-800">*</span>} 
                
            </label>

            {accept && <p className="mt-1 text-xs text-gray-500 italic">Accept: {accept}</p>}

            <div className="mt-2 flex items-center gap-x-3">
                {(input.value === 'remove' || !input.value) && <UserCircleIcon className="block h-12 w-12 text-gray-300 border rounded-full" aria-hidden="true" />}
                {(input.value && input.value != 'remove') && <img className="h-12 w-12 rounded-full" src={input.value ? (typeof input.value === 'object' ? URL.createObjectURL(input.value) : input.value) : user.profile_photo_url} alt="" />}

                <div className="flex items-center">
                    <label>
                        <input 
                            ref={inputRef}
                            id={input.id}
                            onChange={changeHandler}
                            type="file"
                            placeholder={placeholder}
                            accept={accept}
                            className="text-sm text-grey-500
                            file:mr-5 file:py-2 file:px-6
                            file:rounded-full file:border-0
                            file:text-sm file:font-medium
                            file:bg-gray-50 file:text-grandkit-700
                            hover:file:cursor-pointer hover:file:bg-gray-100
                            hover:file:text-grankit-900" 
                        />
                    </label>

                    {(input.value) && 
                        <button
                        onClick={remove}
                        type="button"
                        className="ml-3 rtl:mr-3 rounded-full bg-transparent p-1 text-white hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                    >
                        <TrashIcon className="h-5 w-5 text-grandkit-600" aria-hidden="true" />
                    </button>}

                    {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                    </div>}
                </div>
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}