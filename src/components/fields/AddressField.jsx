import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

export default function AddressField(props) {
    const { label, input, meta, placeholder = null, col = 3, required = false, showHeading = true } = props
    const [address, setAddress] = useState(input.value ? input.value : {
        address: '',
        city: '',
        region: '',
        country: '',
        zipcode: '',
    });
    const [country, setCountry] = useState(address.country);
    const [region, setRegion] = useState(address.region);
    //console.log(input)

    function handleChangeAddress(value) {
        setAddress({
            ...address,
            address: value
        });
        input.onChange({
            ...address,
            address: value
        })
    }

    function handleChangeCity(value) {
        setAddress({
            ...address,
            city: value
        });
        input.onChange({
            ...address,
            city: value
        })
    }

    function handleChangeCountry(value) {
        setCountry(value)
        setAddress({
            ...address,
            country: value
        });
        input.onChange({
            ...address,
            country: value
        })
    }

    function handleChangeRegion(value) {
        setRegion(value)
        setAddress({
            ...address,
            region: value
        });
        input.onChange({
            ...address,
            region: value
        })
    }

    function handleChangeZipcode(value) {
        setAddress({
            ...address,
            zipcode: value
        });
        input.onChange({
            ...address,
            zipcode: value
        })
    }

    return (
        <div className={showHeading ? 'border-t border-gray-200 pt-4' : ''}>
            {showHeading && <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">{label}</h3>
                <p className="mt-1 text-sm text-gray-500">This information will be used to generate invoices.</p>
            </div>}

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className={'sm:col-span-6'}>
                    <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                        Address {required && <span className="text-red-800">*</span>}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            value={address.address ?? ''}
                            onChange={(ev) => handleChangeAddress(ev.target.value)}
                            type="text"
                            placeholder={'Enter your address'}
                            className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                        />
                        {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                        </div>}
                    </div>
                </div>
                <div className={'sm:col-span-6'}>
                    <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                        City {required && <span className="text-red-800">*</span>}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            value={address.city ?? ''}
                            onChange={(ev) => handleChangeCity(ev.target.value)}
                            type="text"
                            placeholder={'Enter city'}
                            className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                        />
                        {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                        </div>}
                    </div>
                </div>
                <div className={'sm:col-span-2'}>
                    <label className="block text-sm font-medium text-gray-700">
                        Country {required && <span className="text-red-800">*</span>}
                    </label>
                    <CountryDropdown
                        classes={ (meta.error && meta.touched) ? 'mt-1 block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'mt-1 shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                        value={country ?? ''}
                        onChange={(val) => handleChangeCountry(val)} />
                </div>
                <div className={'sm:col-span-2'}>
                    <label className="block text-sm font-medium text-gray-700">
                        State / Province {required && <span className="text-red-800">*</span>}
                    </label>
                    <RegionDropdown
                        classes={ (meta.error && meta.touched) ? 'mt-1 block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'mt-1 shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                        country={country}
                        value={region ?? ''}
                        onChange={(val) => handleChangeRegion(val)} />
                </div>
                <div className={'sm:col-span-2'}>
                    <label className="block text-sm font-medium text-gray-700">
                        Zip Code {required && <span className="text-red-800">*</span>}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            value={address.zipcode ?? ''}
                            onChange={(ev) => handleChangeZipcode(ev.target.value)}
                            type="text"
                            placeholder={'Enter zip code'}
                            className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                        />
                        {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                        </div>}
                    </div>
                </div>
            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}
