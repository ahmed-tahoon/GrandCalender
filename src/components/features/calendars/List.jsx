import { MapPinIcon, ArrowTopRightOnSquareIcon, LockClosedIcon, ClockIcon, ClipboardDocumentIcon, MagnifyingGlassIcon, PlusIcon, CalendarDaysIcon, PresentationChartLineIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import Pagination from 'components/common/NumberPagination';
import SkeletonTable from 'components/common/SkeletonTable';
import DropdownButton from './DropdownButton'
import axios from 'axios';
import AlertModal from 'components/common/AlertModal';
import SubscriptionModal from 'components/common/SubscriptionModal';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import bookingUrl from 'utils/bookingUrl';

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function List({user}) {
    const [isLoaded, setIsLoaded] = useState(false);
    let [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState([]);
    const [deletingModel, setDeletingModel] = useState(null)
    const [deleteModelModalOpen, setDeleteModelModalOpen] = useState(false)
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState(null)

    function loadItems(params = {}) {
        axios.get("/api/calendars", {
                params: params,
            })
            .then(function (response) {
                // handle success
                setIsLoaded(true)
                setItems(response.data.data);
                setPaginationMeta(response.data.meta);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    function reloadItems(key, value) {
        let params = {};
        searchParams.forEach((key, value) => {
            params[value] = key;
        });
        params[key] = value;

        // Load tab
        if (key != "page") {
            params["page"] = 1;
        }

        loadItems(params);
    }

    function refreshItems() {
        let params = {};
        searchParams.forEach((key, value) => {
            params[value] = key;
        });

        loadItems(params);
    }

    // Set page title
    useEffect(() => {
        loadItems()
    }, []);

    function deleteModel(item) {
        setDeletingModel(item)
        setDeleteModelModalOpen(true)
    }

    // Delete payment method
    function confirmDeleteModel() {
        const formData = new FormData();
        formData.append("_method", 'delete');

        axios
            .post("/api/calendars/"+deletingModel?.id, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'success') {
                    toast.success('Calendar deleted successfully');
                }
                setDeletingModel(null)
                setDeleteModelModalOpen(false)
                refreshItems()
            })
            .catch(function (error) {
            });
    }

    function copyToClipboard(value) {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard');
    }

    const turnOn = async (id) => {
        const formData = new FormData();
        formData.append("_method", 'put');
        formData.append("is_on", 'yes');

        try {
            await axios.post(`/api/calendars/${id}/update-status`, formData);
            refreshItems();
        } catch (error) {
            console.log(error);
            setSubscriptionModalOpen(true)
        }
    }

    function turnOff(id) {
        const formData = new FormData();
        formData.append("_method", 'put');
        formData.append("is_on", 'no');

        axios
            .post(`/api/calendars/${id}/update-status`, formData)
            .then(function (response) {
                refreshItems();
            })
            .catch(function (error) {
                resolve();
            });
    }

    const readableDuration = (item) => {
        let duration = '';
        if (item.original_duration > 60) {
            duration = Math.floor(item.original_duration / 60) + ' hrs';
        }
        if (item.original_duration % 60 > 0) {
            duration += ' ' + (item.original_duration % 60) + ' min';
        }

        return duration;
    }


    return (
        <div>
            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900 uppercase">Calendars</h3>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                    <label htmlFor="mobile-search-candidate" className="sr-only">
                    Search
                    </label>
                    <label htmlFor="desktop-search-candidate" className="sr-only">
                    Search
                    </label>
                    <div className="flex rounded-md shadow-sm">
                    <div className="relative flex-grow focus-within:z-10">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            onChange={(ev) => { setSearchQuery(ev.target.value); loadItems({q: ev.target.value})}}
                            type="text"
                            name="mobile-search-candidate"
                            id="mobile-search-candidate"
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-grandkit-500 focus:ring-grandkit-500 sm:hidden"
                            placeholder="Search"
                        />
                        <input
                            onChange={(ev) => { setSearchQuery(ev.target.value); loadItems({q: ev.target.value})}}
                            type="text"
                            name="desktop-search-candidate"
                            id="desktop-search-candidate"
                            className="hidden w-full rounded-md border-gray-300 pl-10 focus:border-grandkit-500 focus:ring-grandkit-500 sm:block sm:text-sm"
                            placeholder="Search calendars"
                        />
                    </div>
                    {/* <button
                        type="button"
                        className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-grandkit-500 focus:outline-none focus:ring-1 focus:ring-grandkit-500"
                    >
                        <BarsArrowUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="ml-2">Sort</span>
                        <ChevronDownIcon className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </button> */}
                    </div>
                </div>

                <Link
                    to="/dashboard/calendars/create"
                    className="g-primary-btn whitespace-nowrap"
                >
                    Create
                </Link>
            </div>

            {isLoaded && <ul role="list" className="divide-y divide-gray-200">
                {items.map((item) => (
                <li key={item.id}>
                    <div className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                            <div className='flex items-center pb-2'>
                                {item?.color && <div className={`ml-1 mr-2 rtl:ml-2 flex-shrink-0 h-3 w-3 rounded-full`} style={{backgroundColor: item.color}} />}
                                <div className="flex w-full items-center justify-between">
                                    <div className="truncate text-sm font-medium text-grandkit-600 capitalize" style={{color: item.color}}><Link to={"/dashboard/calendars/"+item.id}>{item.name}</Link></div>
                                    <div className="flex flex-shrink-0">
                                        {item.is_on && <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                        ON
                                        </p>}
                                        {!item.is_on && <p className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                                        OFF
                                        </p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500 space-s-1.5">
                                <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <span>{readableDuration(item)}</span>
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                    <CalendarDaysIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    {item.availability.description}
                                </p>
                            </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex space-s-6">
                                    <button onClick={() => copyToClipboard(bookingUrl(user.username, item.slug))} className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <ClipboardDocumentIcon className="mr-1.5 rtl:ml-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        Copy Link
                                    </button>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                        {item.expired_at && <><LockClosedIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" /><p>Closing on <time dateTime={item.expired_at}>{item.expired_at}</time></p></>}
                                    </p>
                                    <Link to={`/dashboard/bookings?calendar_id=${item.id}`} className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 cursor-pointer hover:text-grandkit-600">
                                        <PresentationChartLineIcon className="mr-1.5 rtl:ml-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <span className={`
                                                ${item.total_bookings >= user.current_plan.bookings && user.current_plan.bookings != -1  ? 'text-red-600 hover:text-red-800' : ''}
                                            `}>
                                            <span className="font-bold mr-0.5">{item.total_bookings}</span>{user.current_plan.bookings != -1 && <span>/<span className="font-bold ml-0.5 mr-1.5">{user.current_plan.bookings}</span></span>} Bookings
                                        </span>
                                    </Link>
                                </div>
                                    <DropdownButton item={item} refreshItems={refreshItems} deleteModel={deleteModel} turnOn={turnOn} turnOff={turnOff} />
                            </div>
                            {item.total_bookings >= user.current_plan.bookings && user.current_plan.bookings != -1  && <div className="rounded-md bg-orange-50 p-2 mt-3">
                                <div className="flex">
                                    <div className="ml-3">
                                            <h3 className="text-sm font-medium text-orange-800">
                                                <Link
                                                    to="/dashboard/plans"
                                                    className="font-bold text-orange-800 hover:text-orange-900 transition ease-in-out duration-150 focus:outline-none focus:underline underline"
                                                >
                                                    Upgrade your plan
                                                </Link>
                                                , you have reached your bookings limit (calendar is closed)</h3>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </li>
                ))}
            </ul>}

            {!isLoaded && <SkeletonTable rows={3} />}

            {/* Pagination */}
            {(items.length > 0 && isLoaded) && (
                <Pagination
                    paginationMeta={paginationMeta}
                    reloadData={reloadItems}
                />
            )}

            {(items.length === 0 && isLoaded) && (<div className="text-center mt-8 mb-6">
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
                {searchQuery ? <p className="mt-1 text-sm text-gray-500">No calendar found</p> : <p className="mt-1 text-sm text-gray-500">No calendar added</p>}
                {!searchQuery && <div className="mt-6">
                    <Link to="/dashboard/calendars/create"
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-grandkit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add
                    </Link>
                </div>}
            </div>)}

            <AlertModal
                title="Delete calendar"
                note={`${deletingModel?.upcoming_bookings > 0 ? 'Calendar cannot be <strong>deleted due to '+deletingModel?.upcoming_bookings+' upcoming bookings</strong>. you can delete the calendar after these bookings are done or cancelled. In the meantime, you can <strong>turn off</strong> the calendar to stop accepting new bookings.' : 'Are you sure you want to delete this calendar?'}`}
                close={() => setDeleteModelModalOpen(false)}
                open={deleteModelModalOpen}
                confirm={() => confirmDeleteModel()}
                confirmActive={deletingModel?.upcoming_bookings > 0 ? false : true}
            />
            <SubscriptionModal
                title="Upgrade your plan"
                message={`Upgrade now for additional active calendars! Manage your schedules effortlessly and never miss an important event`}
                close={() => setSubscriptionModalOpen(false)}
                open={subscriptionModalOpen}
                route="/dashboard/plans"
            />

        </div>
    )
}
