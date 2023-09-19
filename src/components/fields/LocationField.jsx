import {
    DocumentDuplicateIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import LocationFieldModal from "./components/LocationFieldModal";
import googleMeetSVG from "assets/integrations/google-meet.svg";
import zoomSVG from "assets/integrations/zoom.svg";


export default function LocationField(props) {
    const {
        label,
        subLabel = "",
        input,
        meta,
        placeholder = "",
        col = 3,
        required = false,
        serverError = null,
    } = props;
    const [isShowModal, setIsShowModal] = useState(false);
    const [fields, setFields] = useState(
        Array.isArray(input.value) ? input.value : []
    );
    const [edittingField, setEdittingField] = useState(undefined);
    const [edittingFieldIndex, setEdittingFieldIndex] = useState(undefined);

    useEffect(() => {
        input.onChange(fields);
    }, [fields]);

    function onAddField(values) {
        console.log(values);
        let newField = JSON.parse(JSON.stringify(values));
        let newFields = fields.slice();
        newFields.push(newField);
        setFields(newFields);
        closeModal();
    }

    function onSaveField(values, index) {
        let newFields = fields.slice();
        newFields[index] = values;
        setFields(newFields);
        closeModal();
    }

    function deleteField(index) {
        let newFields = fields.slice();
        newFields.splice(index, 1);
        setFields(newFields);
    }

    function editField(index) {
        let field = JSON.parse(JSON.stringify(fields[index]));
        setEdittingField(field);
        setEdittingFieldIndex(index);
        setIsShowModal(true);
    }

    function duplicateField(index) {
        let field = JSON.parse(JSON.stringify(fields[index]));
        let newFields = fields.slice();
        newFields.push(field);
        setFields(newFields);
    }

    function closeModal() {
        setEdittingField(undefined);
        setEdittingFieldIndex(undefined);
        setIsShowModal(false);
    }

    function displayName(field) {
        const phoneCall = (
            <span className="flex">
                <svg
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-sky-500"
                    viewBox="0 0 24 24"
                    width="16px"
                    height="16px"
                    data-testid="inbound_call"
                >
                    <title>Phone call</title>
                    <path
                        d="M15.415 22.655c2.356 1.51 5.218 1.174 7.238-.84l.842-.838c.673-.672.673-2.014 0-2.685l-3.012-3.006c-.673-.671-1.541-.2-2.215.472-.673.671-2.679 1.334-3.352.663l-7.35-7.144c-.674-.671-.016-2.677.658-3.348.673-.671.673-2.014 0-2.685L5.65.67C4.977 0 3.63 0 2.957.671l-.841.671C.264 3.356-.073 6.21 1.274 8.558a56.353 56.353 0 0014.14 14.097z"
                        fill="currentColor"
                    ></path>
                </svg>
                <span className="ml-2">Phone call</span>
            </span>
        );
        if (field.kind === "inbound_call") {
            return phoneCall;
        }
        if (field.kind === "outbound_call") {
            return phoneCall;
        }
        if (field.kind === "location") {
            return (
                <span className="flex">
                    <svg
                        fill="none"
                        className="text-purple-500"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16px"
                        height="16px"
                        data-testid="physical"
                    >
                        <title>Physical location</title>
                        <path
                            d="M12 0C7.453 0 3.623 3.853 3.623 8.429c0 6.502 7.18 14.931 7.42 15.172.479.482 1.197.482 1.675.24l.24-.24c.239-.24 7.419-8.67 7.419-15.172C20.377 3.853 16.547 0 12 0zm0 11.56c-1.675 0-2.872-1.445-2.872-2.89S10.566 5.78 12 5.78c1.436 0 2.872 1.445 2.872 2.89S13.675 11.56 12 11.56z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    <span className="ml-2">In-person meeting</span>
                </span>
            );
        }
        if (field.kind === "link") {
            return (
                <span className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span className="ml-2">Link meeting</span>
                </span>
            );
        }
        if (field.kind === "google_meet") {
            return (
                <span className="flex items-center">
                    <img src={googleMeetSVG} className="h-4 w-4 mr-2 mb-0.5" />
                    <span className="ml-2">Google Meet</span>
                </span>
            );
        }
        if (field.kind === "zoom") {
            return (
                <span className="flex items-center">
                    <img src={zoomSVG} className="h-4 w-4 mr-2 mb-0.5" />
                    <span className="ml-2">Zoom Meeting</span>
                </span>
            );
        }
        if (field.kind === "conference") {
            return "Conference";
        }
    }

    return (
        <div className={"sm:col-span-" + col}>
            <label
                htmlFor={input.name}
                className="block text-sm font-medium text-gray-700"
            >
                {label} {required && <span className="text-red-800">*</span>}
            </label>

            <div className="text-xs italic g-helptext-color py-1">
                {subLabel ? (
                    <span>{subLabel}</span>
                ) : (
                    <>
                        <p>
                            Use the "Location" field to specify how and where
                            both parties will connect at the scheduled time.
                        </p>
                        <p>
                            The location entered here will appear on the
                            confirmation page after events are scheduled and in
                            the calendar event added to both you and your
                            invitee's calendars.
                        </p>
                    </>
                )}
            </div>

            <div className="mt-1 relative">
                {fields.map((field, index) => (
                    <div
                        key={index}
                        className="mb-2 relative border text-xs shadow-sm rounded-md p-2 space-y-1"
                    >
                        <div className="flex justify-start mr-40">
                            <div>
                                <div className="font-medium mr-2">
                                    {displayName(field)}
                                </div>
                            </div>
                            <div>
                                {field.kind === "location" && (
                                    <div>{field.location}</div>
                                )}
                                {field.kind === "link" && (
                                    <div>{field.link}</div>
                                )}
                                {field.kind === "inbound_call" && (
                                    <div>{field.phone_number}</div>
                                )}
                            </div>
                        </div>

                        <div className="absolute right-2 bottom-2 top-2 space-x-1 flex justify-between items-center">
                            <button
                                type="button"
                                className="g-icon-btn"
                                onClick={() => editField(index)}
                            >
                                <PencilIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                type="button"
                                className="g-icon-btn"
                                onClick={() => duplicateField(index)}
                            >
                                <DocumentDuplicateIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                type="button"
                                className="g-icon-btn"
                                onClick={() => deleteField(index)}
                            >
                                <TrashIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="mb-2 relative border text-sm shadow-sm rounded-md p-8 text-center space-y-1 text-gray-600">
                        No location
                    </div>
                )}

                <button
                    className="g-default-btn-sm inine-flex items-center gap-x-1.5"
                    onClick={() => setIsShowModal(true)}
                    type="button"
                >
                    <span>Add location</span>
                    <PlusIcon className="-mr-0.5 h-4 w-4" aria-hidden="true" />
                </button>
            </div>
            {meta.error && meta.touched && (
                <p className="mt-2 text-sm text-red-800">{meta.error}</p>
            )}
            {serverError && serverError[input.name] && (
                <div className="mt-2 text-sm text-red-800">
                    {serverError[input.name][0]}
                </div>
            )}

            <LocationFieldModal
                edittingField={edittingField}
                edittingFieldIndex={edittingFieldIndex}
                open={isShowModal}
                close={closeModal}
                onAddField={onAddField}
                onSaveField={onSaveField}
                fields={fields}
            />
        </div>
    );
}
