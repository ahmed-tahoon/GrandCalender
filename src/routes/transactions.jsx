import { useEffect, useState } from "react";
import SideBar from "components/features/settings/SideBar";
import Tabs from "components/features/settings/Tabs";
import axios from 'axios';

import AppLayout from "layouts/AppLayout";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import NumberPagination from "components/common/NumberPagination";
import { PlusIcon } from "@heroicons/react/20/solid";
import TransactionDetail from "components/features/settings/TransactionDetail";
import SkeletonTable from "components/common/SkeletonTable";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function transactions() {
    const { user } = useLoaderData();
    let [searchParams, setSearchParams] = useSearchParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [transactionDetailModalOpen, setTransactionDetailModalOpen] = useState(false);
    const [paginationMeta, setPaginationMeta] = useState([]);


    function loadTransactions(params = {}) {
        axios.get("/api/transactions", {
                params: params,
            })
            .then(function (response) {
                // handle success
                setIsLoaded(true)
                setTransactions(response.data.data);
                setPaginationMeta(response.data.meta);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    function reloadTransactions(key, value) {
        let params = {};
        searchParams.forEach((key, value) => {
            params[value] = key;
        });
        params[key] = value;

        // Load tab
        if (key != "page") {
            params["page"] = 1;
        }

        loadTransactions(params);
    }

    // Set page title
    useEffect(() => {
        document.title = 'Orders & Billings';
        loadTransactions()
    }, []);


    return (
        <AppLayout  user={user} sideBar={<SideBar />}>
            <Tabs />

            {/* Billing history */}
            {!currentTransaction && <section className="-mx-6 -mb-6" aria-labelledby="billing-history-heading">
                <div className="pt-2 sm:overflow-hidden sm:rounded-md">
                  {/* <div className="px-4 sm:px-6">
                    <h2 id="billing-history-heading" className="text-lg font-medium leading-6 text-gray-900 uppercase">
                      Billing history
                    </h2>
                  </div> */}
                  <div className="mt-6 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-t border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                  #
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                  Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                                {/*
                                  `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                                */}
                                <th
                                  scope="col"
                                  className="relative px-6 py-3 text-left text-sm font-medium text-gray-500"
                                >
                                  <span className="sr-only">View receipt</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {transactions.map((transaction) => (<tr key={transaction.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {transaction.hid}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        <time dateTime={transaction.created_at}>{transaction.created_at}</time>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        <Link to={'/dashboard/orders-billings/' + transaction.id} className="ml-4 text-grandkit-600 hover:text-grandkit-700">
                                            {transaction.subscription_number}
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {transaction.total}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <Link to={'/dashboard/transactions/'+transaction.id} className="mr-4 text-grandkit-600 hover:text-grandkit-700">
                                            Details
                                        </Link>

                                        {/* <a href={transaction.invoice_url} target="_blank" rel="nofollow" className="text-grandkit-600 hover:text-grandkit-700">
                                            Invoice
                                        </a> */}
                                        <Link to={`/dashboard/transactions/invoice/${transaction.id}`} className="text-grandkit-600 hover:text-grandkit-700">
                                            Invoice
                                        </Link>
                                    </td>
                                </tr>))}
                            </tbody>
                          </table>

                          {!isLoaded && <SkeletonTable rows={3} />}

                          {/* Pagination */}
                            {(transactions.length > 0 && isLoaded) && (
                                <NumberPagination
                                    paginationMeta={paginationMeta}
                                    reloadData={reloadTransactions}
                                />
                            )}


                            {(transactions.length === 0 && isLoaded) && (<div className="text-center mb-6">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Transactions</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by subscribing to a plan.
                                </p>
                                <div className="mt-6">
                                    <Link to="/dashboard/plans"
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-grandkit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                                    >
                                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                        Select a plan
                                    </Link>
                                </div>
                            </div>)}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>}

              {currentTransaction && <TransactionDetail transaction={currentTransaction} close={() => {setCurrentTransaction(null); }} />}
      </AppLayout>
    )
}
