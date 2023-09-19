import { ClockIcon, GlobeAltIcon, PlusIcon } from '@heroicons/react/20/solid'
import Pagination from 'components/common/NumberPagination';
import SkeletonTable from 'components/common/SkeletonTable';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DropdownButton from './DropdownButton'
import axios from 'axios';
import AlertModal from 'components/common/AlertModal';
import { toast } from 'react-toastify';

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function List({user}) {
    let [searchParams, setSearchParams] = useSearchParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [defaultItems, setDefaultItems] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState([]);
    const [defaultId, setDefaultId] = useState(user.default_availability_id)
    const [deletingModelId, setDeletingModelId] = useState(null)
    const [deleteModelModalOpen, setDeleteModelModalOpen] = useState(false)

    function loadItems(params = {}) {
        axios.get("/api/availabilities", {
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

    function loadDefaultItems(params = {}) {
        axios.get("/api/default-availabilities", {
                params: params,
            })
            .then(function (response) {
                // handle success
                setDefaultItems(response.data.data);
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

    function reloadDefaultItems(key, value) {
        let params = {};
        searchParams.forEach((key, value) => {
            params[value] = key;
        });
        params[key] = value;

        // Load tab
        if (key != "page") {
            params["page"] = 1;
        }

        loadDefaultItems(params);
    }

    function refreshItems() {
        let params = {};
        searchParams.forEach((key, value) => {
            params[value] = key;
        });

        loadDefaultItems();
        loadItems(params);
    }

    // Set page title
    useEffect(() => {
        loadDefaultItems()
        loadItems()
    }, []);

    function deleteModel(id) {
        setDeletingModelId(id)
        setDeleteModelModalOpen(true)
    }

    // Delete payment method
    function confirmDeleteModel() {
        const formData = new FormData();
        formData.append("_method", 'delete');
        
        axios
            .post("/api/availabilities/"+deletingModelId, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'success') {
                    toast.success('Availability deleted successfully');
                }
                setDeletingModelId(null)
                setDeleteModelModalOpen(false)
                refreshItems()
                reloadDefaultItems()
            })
            .catch(function (error) {
            });
    }


    return (
    <div>
        {isLoaded && <ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
            {defaultItems.map((item) => (
            <li key={item.id}>
                <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-grandkit-600"><Link to={'/dashboard/availability/'+item.id}>{item.name}</Link></p>
                    <div className="flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-grandkit-600">
                        Default
                        </p>
                    </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="mr-1.5 rtl:ml-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                {item.description}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                                <GlobeAltIcon className="mr-1.5 rtl:ml-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                {item.timezone}
                            </p>
                        </div>
                        <DropdownButton defaultId={defaultId} item={item} setDefaultId={setDefaultId} deleteModel={deleteModel} />
                    </div>
                </div>
                </div>
            </li>
            ))}
        </ul>}

        {isLoaded && <ul role="list" className="divide-y divide-gray-200">
            {items.map((item) => (
            <li key={item.id}>
                <div href="#" className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-grandkit-600"><Link to={'/dashboard/availability/'+item.id}>{item.name}</Link></p>
                    <div className="ml-2 flex flex-shrink-0">
                       
                    </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                {item.description}
                            </p>
                        </div>
                        
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                                <GlobeAltIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                {item.timezone}
                            </p>
                        </div>
                        <DropdownButton defaultId={defaultId} item={item} setDefaultId={setDefaultId} deleteModel={deleteModel} reloadDefaultItems={reloadDefaultItems} reloadItems={reloadItems} />
                    </div>
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

        {(items.length === 0 && defaultItems.length === 0 && isLoaded) && (<div className="text-center mt-8 mb-6">
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
            <p className="mt-1 text-sm text-gray-500">No availability added</p>
            <div className="mt-6">
                <Link to="/dashboard/availability/create"
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-grandkit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                >
                    <PlusIcon className="-ml-1 mr-2 rtl:ml-2 h-5 w-5" aria-hidden="true" />
                    Add
                </Link>
            </div>
        </div>)}

        <AlertModal
            title="Delete availability"
            note={`Are you sure you want to delete this availability?`}
            confirm={confirmDeleteModel}
            close={() => setDeleteModelModalOpen(false)}
            open={deleteModelModalOpen}
        />

    </div>
    )
}
