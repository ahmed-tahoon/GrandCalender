import { XMarkIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

export default function ErrorPaymentTopBanner({user}) {
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-red-800 py-2.5 px-6 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
        <p className="text-sm leading-6 text-white">
          We are unable to renew your subscription because of {user.current_subscription_grace_period_reason}. Please update your payment information by max {user.current_subscription_payment_update_deadline}. 
        </p>
        <Link
          to="/dashboard/plans"
          className="flex-none rounded-full bg-gray-900 py-1 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Check your subscription <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        {/* <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
        </button> */}
      </div>
    </div>
  )
}
