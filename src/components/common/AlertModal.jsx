import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import LoadingIcon from "components/buttons/LoadingIcon";

export default function AlertModal(props) {
    const {
        open,
        confirm,
        close,
        confirmButtonText,
        note,
        title,
        importantNote,
        prompt = null,
        confirmActive = true,
    } = props;
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setSubmitting(false);
    }, [open]);

    function handleConfirm() {
        setSubmitting(true);
        confirm();
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

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                    <button
                                        type="button"
                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
                                        onClick={() => close()}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationCircleIcon
                                            className="h-6 w-6 text-red-800"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            {title}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500"
                                            dangerouslySetInnerHTML={{__html: note
                                                ? note
                                                : "Are you sure you want to do this? This action cannot be undone."}}
                                            >
                                            </p>
                                            <div>{importantNote}</div>
                                        </div>
                                        {prompt &&
                                            prompt.type !== "textarea" && (
                                                <div className="mt-2">
                                                    <input
                                                        id="prompt"
                                                        type={prompt.type}
                                                        value={prompt.value}
                                                        onChange={(e) =>
                                                            prompt.onChange(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={
                                                            prompt.placeholder
                                                        }
                                                        className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm"
                                                    />
                                                </div>
                                            )}

                                        {prompt &&
                                            prompt.type === "textarea" && (
                                                <div className="mt-2">
                                                    <label
                                                        htmlFor="prompt"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {prompt.label}
                                                    </label>
                                                    <textarea
                                                        id="prompt"
                                                        type={prompt.type}
                                                        value={prompt.value}
                                                        onChange={(e) =>
                                                            onChange(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={
                                                            prompt.placeholder
                                                        }
                                                        className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    {confirmActive && <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => handleConfirm()}
                                    >
                                        <LoadingIcon loading={submitting} />
                                        {submitting ? (
                                            "Processing.."
                                        ) : (
                                            <>
                                                {confirmButtonText
                                                    ? confirmButtonText
                                                    : "Confirm"}
                                            </>
                                        )}
                                    </button>}
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-0sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => close()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
