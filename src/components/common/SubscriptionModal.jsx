import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import LoadingIcon from "components/buttons/LoadingIcon";
import { Link } from "react-router-dom";

export default function SubscriptionModal(props) {
    const { open, confirm, close, title, message, route, confirmButtonText } = props;
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        setSubmitting(false)
      }, [open])

    function handleConfirm() {
        setSubmitting(true)
        confirm()
      }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={close}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                                        {/* <CheckIcon
                                            className="h-6 w-6 text-green-600"
                                            aria-hidden="true"
                                        /> */}
                                        <svg
                                            fill="currentColor"
                                            height="800px"
                                            width="800px"
                                            version="1.1"
                                            id="Capa_1"
                                            viewBox="0 0 267.5 267.5"
                                            className="h-6 w-6 text-yellow-600"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M256.975,100.34c0.041,0.736-0.013,1.485-0.198,2.229l-16.5,66c-0.832,3.325-3.812,5.663-7.238,5.681l-99,0.5
                                                    c-0.013,0-0.025,0-0.038,0H35c-3.444,0-6.445-2.346-7.277-5.688l-16.5-66.25c-0.19-0.764-0.245-1.534-0.197-2.289
                                                    C4.643,98.512,0,92.539,0,85.5c0-8.685,7.065-15.75,15.75-15.75S31.5,76.815,31.5,85.5c0,4.891-2.241,9.267-5.75,12.158
                                                    l20.658,20.814c5.221,5.261,12.466,8.277,19.878,8.277c8.764,0,17.12-4.162,22.382-11.135l33.95-44.984
                                                    C119.766,67.78,118,63.842,118,59.5c0-8.685,7.065-15.75,15.75-15.75s15.75,7.065,15.75,15.75c0,4.212-1.672,8.035-4.375,10.864
                                                    c0.009,0.012,0.02,0.022,0.029,0.035l33.704,45.108c5.26,7.04,13.646,11.243,22.435,11.243c7.48,0,14.514-2.913,19.803-8.203
                                                    l20.788-20.788C238.301,94.869,236,90.451,236,85.5c0-8.685,7.065-15.75,15.75-15.75s15.75,7.065,15.75,15.75
                                                    C267.5,92.351,263.095,98.178,256.975,100.34z M238.667,198.25c0-4.142-3.358-7.5-7.5-7.5h-194c-4.142,0-7.5,3.358-7.5,7.5v18
                                                    c0,4.142,3.358,7.5,7.5,7.5h194c4.142,0,7.5-3.358,7.5-7.5V198.25z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-gray-900"
                                        >
                                            {title}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500"
                                                dangerouslySetInnerHTML={{__html: message}}
                                            >
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    {route && <Link
                                        to={route}
                                        className="inline-flex w-full justify-center rounded-md bg-grandkit-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-grandkit-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                                    >
                                        Upgrade
                                    </Link>}
                                    {confirm && <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-grandkit-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-grandkit-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                                            onClick={() => handleConfirm()}
                                        >
                                            <LoadingIcon loading={submitting} />
                                            {submitting ? 'Processing..' : <>{confirmButtonText ? confirmButtonText : 'Confirm'}</>}
                                        </button>}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
