import { Link } from 'react-router-dom'

export default function TransactionDetail({transaction}) {
  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 uppercase"></h3>
        <p className="mt-1 text-sm text-gray-500">
          <Link to="/dashboard/transactions" className="rounded-md bg-white font-medium text-grandkit-600 hover:text-grandkit-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2">Back</Link>
        </p>
      </div>
      {transaction && <div className="mt-5 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Transaction</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.hid}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Order Number</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.subscription_number}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Transaction Ref</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.trans_ref}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.type}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.total} ( {`${transaction.amount} Package + ${transaction.vat_amount}`} VAT )</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.payment_method}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Purchased On</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{transaction.created_at}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Invoice</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-shrink-0">
                <Link
                  to={'/dashboard/transactions/invoice/' + transaction.id}
                  type="button"
                  className="mr-2 rounded-md bg-white font-medium text-grandkit-600 hover:text-grandkit-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                >
                  Preview
                </Link>
              </span>
            </dd>
          </div>
        </dl>
      </div>}
    </>
  )
}
