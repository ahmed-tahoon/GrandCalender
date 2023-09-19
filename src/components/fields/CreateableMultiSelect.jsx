import { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import axios from 'axios';

// Axios
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
axios.defaults.withCredentials = true

export default function CreateableMultiSelect(props) {
    const { path, createPath, createParams, label, description = null, input, meta, col = 3, required = false } = props
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([])
    const [selectedItems, setSelectedItems] = useState(input.value)

    function reloadData() {
        setSelectedItems([])
        axios.get('/'+path)
            .then(function (response) {
                //console.log(response.data)
                setOptions(response.data.data)
                if(input.value) {
                    setSelectedItems(input.value);
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
        reloadData();
    }, [path])


    function handleChange(value) {
        setSelectedItems(value)
        input.onChange(value)
    }

    function handleCreate(inputValue) {
        setIsLoading(true);

        axios.post(createPath, {
            name: inputValue,
            ...createParams,
        }).then(function (response) {
            const createdData = response.data.data;
            axios.get('/'+path)
                .then(function (response) {
                    //console.log(response.data)
                    setTimeout(() => {
                        setOptions(response.data.data)
                        setSelectedItems([...selectedItems, createdData]);
                        input.onChange([...selectedItems, createdData])
                        setIsLoading(false);
                    }, 1000);
                }); 
        }).catch(function (error) {
            setIsLoading(false);    
        });
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            
            {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}

            <div className="mt-1 relative rounded-md shadow-sm">
                <CreatableSelect
                    isMulti
                    isClearable
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    options={options}
                    value={selectedItems}
                />
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
        
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}
