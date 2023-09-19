import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
export default function OrderDetails({order}) {
  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900"></h3>
        <p className="mt-1 text-sm text-gray-500">
          <Link to="/dashboard/orders-billings" className="rounded-md bg-white font-medium text-grandkit-600 hover:text-grandkit-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2">Back</Link>
        </p>
      </div>
      {order && <div className="mt-5 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Transaction</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <Link to={`/dashboard/transactions/${order.id}`} className="rounded-md bg-white font-medium text-grandkit-600 hover:text-grandkit-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2">
                <span className="flex-grow">{order.hid}</span>
              </Link>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Order Number</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{order.subscription_number}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Plan</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{order.name}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{order.type}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{order.total}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Purchased On</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{order.created_at}</span>
            </dd>
          </div>
        </dl>
      </div>}
    </>
  )
}
