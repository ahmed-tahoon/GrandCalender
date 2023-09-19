import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { Field, Form } from 'react-final-form'
import AddressField from 'components/fields/AddressField'
import axios from 'axios';
import { toast } from 'react-toastify';

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const addressValidator = async function(value) {
    if(!value.address || !value.city || !value.region || !value.country || !value.zipcode) {
        return 'Address is required'
    }
}

export default function AddressFormModal({open, close, user, onSaved}) {

  const actionButtonRef = useRef(null)

  // Send data
  const sendData = (values) =>
    new Promise((resolve) => {
        const formData = new FormData();
        formData.append("profile_form", 'yes');
        formData.append("billing_address", values.address.address ? values.address.address : '');
        formData.append("billing_city", values.address.city ? values.address.city : '');
        formData.append("billing_region", values.address.region ? values.address.region : '');
        formData.append("billing_country", values.address.country ? values.address.country : '');
        formData.append("billing_zipcode", values.address.zipcode ? values.address.zipcode : '');
        formData.append("_method", 'put');
        
        axios
            .post("/api/me", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                resolve();
                if (response.data.status === 'success') {
                    toast.success('Profile updated successfully');
                }
            })
            .catch(function (error) {
                resolve();
            });
    });

    // Submit form
    const onSubmit = async (values) => {
        await sendData(values);
        onSaved();
    };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={actionButtonRef} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <InformationCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900">
                      Your Billing Address
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center ">
                        This information will be used to generate invoices.
                      </p>

                      <Form
                        keepDirtyOnReinitialize
                        onSubmit={onSubmit}
                        initialValues={{...user, address: {
                            address: user.billing_address ?? '',
                            city: user.billing_city ?? '',
                            region: user.billing_region ?? '',
                            country: user.billing_country ?? '',
                            zipcode: user.billing_zipcode ?? '',
                        }}}
                        //decorators={[focusOnError]}
                        render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                            return (
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="space-y-6 mt-6">
                                        <Field name="address" validate={addressValidator}>
                                            {({ input, meta }) => (            
                                            <AddressField required={true} label="Address" input={input} meta={meta} col={6} showHeading={false} />
                                            )}
                                        </Field>

                                        {/* {process.env.NODE_ENV === 'development' && <div>
                                            <pre>{JSON.stringify(values, 0, 2)}</pre>
                                        </div>} */}
                                    </div>

                                    {/* <div className="mt-6 bg-gray-50 rounded-bl-lg rounded-br-lg -mx-6 -mb-6 px-4 py-3 text-right sm:px-6">
                                        <button
                                            disabled={submitting}
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70"
                                        >
                                            {(submitting) ? 'Saving..' : 'Save'}
                                        </button>
                                    </div> */}

                                    <div className="mt-8 sm:mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 ">
                                        {/* <Link
                                            ref={actionButtonRef}
                                            to="/dashboard/profile"
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        >
                                            Edit Profile
                                        </Link> */}
                                        <button
                                            disabled={submitting}
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        >
                                            {(submitting) ? 'Saving..' : 'Save & Continue'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                            onClick={() => close()}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}}
                        />
                    </div>
                  </div>
                </div>
               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
