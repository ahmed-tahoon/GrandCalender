import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsHorizontalIcon,
  PencilIcon,
  PowerIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DropdownButton({defaultId, item, setDefaultId, deleteModel, reloadItems, reloadDefaultItems}) {

  // sendUpdateDefault
  const sendUpdateDefault = (id) =>
  new Promise((resolve) => {
      //setSendingData(true);
      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append("id", id);
      
      axios
          .post("/api/default-availability/"+id, formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          })
          .then(function (response) {
              //setSendingData(false);
              reloadItems();
              reloadDefaultItems();
              setDefaultId(id)
              resolve();
          })
          .catch(function (error) {
              //setSendingData(false);
              resolve();
          });
  });

  function updateDefault(id) {
    sendUpdateDefault(id)
    toast.success('Default availability updated successfully');
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="rounded-full bg-transparent p-1 text-grandkit-600 hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600">
          <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={'/dashboard/availability/'+item.id}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900 w-full' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <PencilIcon className="mr-3 rtl:ml-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Edit
                </Link>
              )}
            </Menu.Item>
            {defaultId != item.id && <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => updateDefault(item.id)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900 w-full' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <PowerIcon className="mr-3 rtl:ml-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Set default
                </button>
              )}
            </Menu.Item>}
            {defaultId != item.id && <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => deleteModel(item.id)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900 w-full' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <TrashIcon className="mr-3 rtl:ml-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Delete
                </button>
              )}
            </Menu.Item>}
          </div>
         
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
