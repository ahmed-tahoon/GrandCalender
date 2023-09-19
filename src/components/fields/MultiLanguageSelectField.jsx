import { useState } from 'react'
import Select from 'react-select'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

const options = [
    { id: "sq", "name": "Albanian", "localName": "shqiptar", "countries": ["Albania", "Kosovo", "North Macedonia"] },
    { id: "ar", "name": "Arabic", "localName": "العربية", "countries": ["Egypt", "Sudan", "Algeria", "Iraq", "Morocco", "Saudi Arabia"] },
    { id: "bn", "name": "Bengali", "localName": "বাংলা", "countries": ["Bangladesh", "India"] },
    { id: "ch", "name": "Chinese", "localName": "中文", "countries": ["China", "Singapore", "Taiwan"] },
    { id: "nl", "name": "Dutch", "localName": "Nederlandse", "countries": ["Netherlands", "Belgium", "Suriname"] },
    { id: "en", "name": "English", "localName": "English", "countries": ["United Kingdom", "Nigeria", "Philippines", "Bangladesh", "India"] },
    { id: "fr", "name": "French", "localName": "Français", "countries": ["Canada", "Belgium", "Switzerland", "Madagascar", "Monaco", "Haiti"] },
    { id: "de", "name": "German", "localName": "German", "countries": ["Germany", "Austria", "Switzerland", "Belgium", "Luxembourg", "Liechtenstein"] },
    { id: "gr", "name": "Greek", "localName": "ελληνική", "countries": ["Greece", "Cyprus"] },
    { id: "gu", "name": "Guarani", "localName": "Avañe'ẽ", "countries": ["Bolivia", "Paraguay"] },
    { id: "hi", "name": "Hindi", "localName": "हिंदुस्तानी", "countries": ["India", "Fiji (known as Hindustani)", "Pakistan (known as Urdu)"] },
    { id: "it", "name": "Italian", "localName": "Italiano", "countries": ["Italy", "Switzerland", "San Marino", "Vatican City"] },
    { id: "ko", "name": "Korean", "localName": "한국어", "countries": ["North Korea", "South Korea"] },
    { id: "ms", "name": "Malay", "localName": "Melayu", "countries": ["Indonesia (known as Indonesian), Malaysia", "Singapore", "Brunei"] },
    { id: "fa", "name": "Persian", "localName": "پارسی", "countries": ["Iran", "Afghanistan (known as Dari), Tajikistan (known as Tajik)"] },
    { id: "pt", "name": "Portuguese", "localName": "Português", "countries": ["Portugal", "Brazil", "Mozambique", "Angola"] },
    { id: "ro", "name": "Romanian", "localName": "Română", "countries": ["Romania", "Moldova"] },
    { id: "ru", "name": "Russian", "localName": "русский", "countries": ["Russia", "Kazakhstan", "Belarus", "Kyrgyzstan"] },
    { id: "sr", "name": "Serbo-Croatian", "localName": "Српско-хрватски", "countries": ["Serbia", "Croatia", "Bosnia and Herzegovina", "Montenegro", "Kosovo"] },
    { id: "es", "name": "Spanish", "localName": "Español", "countries": ["Spain", "Mexico", "Colombia", "Argentina"] },
    { id: "sw", "name": "Swahili", "localName": "Kiswahili", "countries": ["Tanzania", "Kenya", "Uganda", "Rwanda", "Democratic Republic of the Congo"] },
    { id: "sv", "name": "Swedish", "localName": "Swedish", "countries": ["Sweden", "Finland"] },
    { id: "ta", "name": "Tamil", "localName": "தமிழ்", "countries": ["Sri Lanka", "Singapore", "India"] },
    { id: "tr", "name": "Turkish", "localName": "Türk", "countries": ["Turkey", "Cyprus"] },
];
  
export default function MultiLanguageSelectField(props) {
    const { label, helpText, input, meta, placeholder = null, col = 3, isMulti = true, required = false, isClearable = false } = props
    const updatedSelectedItems = (items) => { 
        if(items.length) {
            return items.map((item) => ({ label: item.name, value: item.id, ...item }));
        }
        return [];
    }
    const [selectedItems, setSelectedItems] = useState(updatedSelectedItems(input.value))

    const updatedOptions = options.map((option) => ({
        label: option.name,
        value: option.id,
        ...option
    }));

    function handleChange(value) {
        input.onChange(value)
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <Select
                    onChange={handleChange}
                    defaultValue={selectedItems}
                    options={updatedOptions} 
                    className="basic-multi-select"
                    classNamePrefix="react-select"
                    isClearable={isClearable}
                    isMulti={isMulti}
                />
                {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>}
            </div>
            {helpText && <p className="mt-2 text-sm text-gray-500" id="email-description">{helpText}</p>}
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
        </div>
    )
}