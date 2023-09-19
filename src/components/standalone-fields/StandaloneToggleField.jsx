import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function StandaloneToggleField(props) {
    const {enabled = false, onChange, label, subLabel = null } = props
    const [isEnabled, setIsEnabled] = useState(enabled)

    useEffect(() => {
      setIsEnabled(enabled)
    }, [enabled])

    function handleChange(value) {
        setIsEnabled(value)
        onChange(value)
    }
    

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={isEnabled}
        onChange={handleChange}
        className={classNames(
            isEnabled ? 'bg-grandkit-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            isEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ms-3">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {subLabel && <div className="text-xs italic text-gray-500">{subLabel}</div>}
      </Switch.Label>
    </Switch.Group>
  )
}
