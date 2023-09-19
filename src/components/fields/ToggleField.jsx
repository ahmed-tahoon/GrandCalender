import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ToggleField(props) {
    const { label, subLabel = '', input, meta, col = 3, required = false, hasTopPadding = true } = props
    const [enabled, setEnabled] = useState(input.value)

    function handleChange(value) {
        setEnabled(value)
        input.onChange(value)
    }

    return (
        <div className={(hasTopPadding ? 'pt-8' : '')+' sm:col-span-'+col}>
            <Switch.Group as="div" className="flex items-center">
                <Switch
                    checked={enabled}
                    onChange={handleChange}
                    className={classNames(
                    enabled ? 'bg-grandkit-600' : 'bg-gray-200',
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grandkit-500'
                    )}
                >
                    <span
                    aria-hidden="true"
                    className={classNames(
                        enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                    />
                </Switch>
                <Switch.Label as="span" className="ml-3 rtl:mr-3">
                    <span className="text-sm font-medium text-gray-900">{label}</span>{' '}
                    {subLabel && <div className="text-xs italic text-gray-500">{subLabel}</div>}
                </Switch.Label>
            </Switch.Group>
        </div>
    )
}
