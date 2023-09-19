import { useState, useEffect } from 'react'
import Select from 'react-select'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import axios from 'axios';

// Axios
const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function DataSelectField(props) {
    const { path, label, description = null, input, meta, col = 3, required = false, serverError = null } = props
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(input.value)

    function reloadData(valueId = null) {
        axios.get(apiEndpoint+path+'?type=all')
            .then(function (response) {
                //console.log(response.data.data)
                setOptions(response.data.data)
                const findIndex = response.data.data.findIndex(x => x.id === valueId);
                if(findIndex > -1) {
                    setSelectedOption(response.data.data[findIndex])
                }
                setIsLoading(false);
            })
            .catch(function (error) {
                // handle error
                //setIsLoaded(true);
                //setError(error);
            })
            .then(function () {
                //setIsLoaded(true);
            });
    }

    useEffect(() => {
        // Get options
        reloadData(input.value.id);
    }, [input])


    function handleChange(value) {
        setSelectedOption(value)
        input.onChange(value)
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>

            {description && <p className="mt-2 text-xs text-gray-500 italic">{description}</p>}

            <div className="mt-1 relative rounded-md shadow-sm">
                {/* need to add new availability calendar in select  */}
                <Select
                    onChange={handleChange}
                    value={selectedOption}
                    options={options}
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
