import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PencilIcon, PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import moment from "moment-timezone";
import avatar from "assets/avatar.svg";
import AlertModal from 'components/common/AlertModal';
import AlertModalSuccess from 'components/common/AlertModalSuccess';
import axios from "axios";
import bookingUrl from "utils/bookingUrl";
import { toast } from 'react-toastify';
import googleCalendar from 'assets/google-calendar.svg';
import outlookCalendar from 'assets/outlook-calendar.svg';
import microsoftCalendar from 'assets/microsoft-calendar.svg';
import icsCalendar from 'assets/ics-calendar.png';
import googleMeetSVG from 'assets/integrations/google-meet.svg';
import zoomSVG from 'assets/integrations/zoom.svg';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT

export default function SideOver(props) {
    const { open, setOpen, close, item, user, reloadItems } = props;
    const [editingNoteModelId, setEditingNoteModelId] = useState(null)
    const [meetingNote, setMeetingNote] = useState(item?.extendedProps?.meeting_notes)
    const [cancelModelId, setCancelModelId] = useState(null)
    const [cancelModelModalOpen, setCancelModelModalOpen] = useState(false)
    const [confirmModelId, setConfirmModelId] = useState(null)
    const [confirmModelModalOpen, setConfirmModelModalOpen] = useState(false)


    const getLocation = (location, invitee_phone) => {
        if (!location) return ''
        switch (location.kind) {
            case 'inbound_call':
                return location.phone_number
            case 'outbound_call':
                return invitee_phone
            case 'location':
                return location.location
            case 'link':
                return location.link
            case 'conference':
                return 'Conference'
            default:
                return ''
        }
    }

    const cancellationLink = (booking) => {
        return `${location.origin}/cancellations/${booking.uid}`

    }

    const reschedulingLink = (booking) => {
        return `${location.origin}/cancellations/${booking.uid}`
    }

    const getDescription = (booking) => {
        const eventName = `Event Name: ${booking.extendedProps.calendar?.name}`
        const eventDate = `Event Date: ${moment(booking.extendedProps.date_time).tz(booking.extendedProps?.calendar_availability?.timezone).format('dddd, MMMM DD, YYYY')} at ${moment(booking.extendedProps.date_time).tz(booking.extendedProps.calendar_availability.timezone).format('h:mm A')} - ${moment(booking.extendedProps.date_time).tz(booking.extendedProps.calendar_availability.timezone).add(booking.extendedProps.calendar.duration, 'minutes').format('h:mm A')}`
        const eventLocation = booking.location ? `Location: ${getLocation(booking.location, booking.invitee_phone)}<br><br>` : ''
        const eventInviteeNote = booking.invitee_notes ?  'Please share anything that will help prepare for our meeting.: ' + booking.invitee_notes + '<br><br>' : ''
        const eventCancel = `Need to make changes to this event<br>Cancel: ${cancellationLink(booking)}`
        const eventReschedule = `Reschedule: ${reschedulingLink(booking)}`
        const eventPoweredBy = `Powered by Grandcalendar.io`

        const description = `${eventName}<br><br>
        ${eventDate}
        <br><br>
        ${eventLocation}
        ${eventInviteeNote}
        ${eventCancel}
        <br>
        ${eventReschedule}
        <br><br>
        ${eventPoweredBy}`

        // to url string
        return description
    }

    useEffect(() => { }, [open]);

    const displayLocation = (location, invitee_pnone) => {
        if (location.kind === "inbound_call") {
            return (
            <span className="flex items-start">
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
                    <span className="ml-2 break-all">My invitee will call me on {location.phone_number}</span>
            </span>
        );
        }
        if (location.kind === "outbound_call") {
            return (
            <span className="flex items-start">
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
                    <span className="ml-2 break-all">Please call to attendee's phone number {invitee_pnone}</span>
            </span>
        );
        }
        if (location.kind === "location") {
            return (
                <span className="flex items-start">
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
                    <span className="ml-2 break-all">Location: {location.location}</span>
                </span>
            );
        }
        if (location.kind === "link") {
            return (
                <span className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span className="ml-2">
                        {/* Create link for meeting open new tab */}
                        <a
                            href={location.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-500 hover:text-emerald-600 transition ease-in-out duration-150 hover:underline"
                        >
                            Link meeting
                        </a>
                    </span>
                </span>
            );
        }
        if (location.kind === "google_meet") {
            return (
                <span className="flex items-start">
                    <img src={googleMeetSVG} className="h-4 w-4 mr-1" />
                    <span className="ml-2">
                        {/* Create link for meeting open new tab */}
                        This is a Google Meet web conference.
                        <a
                            href={location.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-grandkit-500 hover:text-grandkit-600 transition ease-in-out duration-150 hover:underline ml-2"
                        >
                            Join Now
                        </a>
                    </span>
                </span>
            );
        }
        if (location.kind === "zoom") {
            return (
                <span className="flex items-start">
                    <img src={zoomSVG} className="h-4 w-4 mr-1" />
                    <span className="ml-2">
                        {/* Create link for meeting open new tab */}
                        This is a Zoom Meeting web conference.
                        <a
                            href={location.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-grandkit-500 hover:text-grandkit-600 transition ease-in-out duration-150 hover:underline ml-2"
                        >
                            Join Now
                        </a>
                    </span>
                </span>
            );
        }
        if (location.kind === "conference") {
            return "Conference";
        }
    }

    function cancelModal(id) {
        setCancelModelId(id)
        setCancelModelModalOpen(true)
    }

    // cancel model
    function confirmCancelModel() {
        const formData = new FormData();

        axios
            .post(`/api/bookings/${cancelModelId}/cancel`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'success') {
                    toast.success('Booking cancelled successfully');
                }
                // update cancelled_at
                setCancelModelId(null)
                setCancelModelModalOpen(false)
                close()
                reloadItems()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function confirmModal(id) {
        setConfirmModelId(id)
        setConfirmModelModalOpen(true)
    }

    function confirmBookingModal() {
        const formData = new FormData();

        axios
            .post(`/api/bookings/${confirmModelId}/confirm`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'success') {
                    toast.success('Booking confirmed successfully');
                }
                setConfirmModelId(null)
                setConfirmModelModalOpen(false)
                close()
                refreshItems()
            })
            .catch(function (error) {
            });
    }

    const hostReschedule = async (item) => {
        const payload = {
            type: 'host'
        }
        try {
            const response = await axios.post(`/api/bookings/${item.id}/reschedule`, payload);
            if (response.data.status === 'success') {
                window.open(`${bookingUrl(user.username, item?.extendedProps?.calendar?.slug)}/${response.data.data.reschedule_uuid}/reschedule?type=host&date=${moment(item.date_time).format('YYYY-MM-DD')}&token=${response.data.token}`, '_blank');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateMeetingNote = async (id) => {
        const payload = {
            meeting_notes: meetingNote
        }
        try {
            // /bookings/{booking}/update-meeting-note
            const response = await axios.post(`/api/bookings/${id}/update-meeting-note`, payload);
            if (response.data.status === 'success') {
                toast.success('Meeting note updated successfully');
            }
            setEditingNoteModelId(null)
            close()
            reloadItems()
        } catch (error) {
            console.log(error);
        }
    }


    return (item.extendedProps &&
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-96">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="sr-only">
                                                    Close panel
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="h-full overflow-y-auto bg-white">
                                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between space-x-3">
                                                <div className="space-y-1">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 flex items-center"
                                                        style={
                                                        {
                                                            color: item.backgroundColor
                                                        }
                                                    }
                                                    >
                                                    {item.extendedProps.calendar.color && <div className={`mr-2 rtl:ml-2 flex-shrink-0 h-2 w-2 rounded-full`} style={{backgroundColor: item.backgroundColor}} />}
                                                        {item.title} ({item?.extendedProps?.duration} mins)
                                                    </Dialog.Title>
                                                    <p className="text-sm text-gray-500">
                                                        <span
                                                            style={
                                                                {
                                                                    color: item.backgroundColor
                                                                }
                                                            }
                                                        >{item?.extendedProps?.calendar.name}</span> - {moment(item?.extendedProps?.date).format("dddd, MMMM Do YYYY")}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item?.extendedProps?.invitee_email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="">
                                            {item?.extendedProps?.cancelled_at !== null && item?.extendedProps?.expired_at === null && <span className="mr-2 rtl:ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>}
                                                {!item?.extendedProps?.is_confirmed && item?.extendedProps?.cancelled_at === null && !item?.extendedProps?.is_past && <span className="mr-1 mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-500">Waiting for confirmation</span>}
                                                {item?.extendedProps?.is_confirmed && item?.extendedProps?.cancelled_at === null && <span className="mr-1 mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">Confirmed</span>}
                                                {item?.extendedProps?.expired_at !== null && item?.extendedProps?.is_past && <span className="mr-1 mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>}
                                                {item?.extendedProps?.rescheduled_at !== null && <span className="mr-1 mt-2 inline-flex items-center rounded-full bg-yellow-50 px-3 py-0.5 text-xs font-medium text-yellow-800">Rescheduled</span>}
                                            </div>
                                            <div className="mt-2">
                                                {!item?.extendedProps?.is_confirmed && item?.extendedProps?.cancelled_at === null && !item?.extendedProps?.is_past && <div className="">
                                                    <button
                                                            onClick={() => confirmModal(item.id)}
                                                        type="button"
                                                        className="g-primary-btn-transparent flex items-center space-x-3"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                                        </div>
                                                    <div className="text-sm font-medium">Confirm booking</div>
                                                    </button>
                                                </div>}
                                                <div className="">
                                                        <button
                                                            // href={`${bookingUrl(user.username, item?.extendedProps?.calendar.slug)}/${item?.extendedProps?.id}/reschedule?type=host&date=${moment(item?.extendedProps?.date_time).format('YYYY-MM-DD')}`}
                                                            // target="_blank"
                                                            onClick={() => hostReschedule(item)}
                                                        className="g-primary-btn-transparent flex items-center space-x-3"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                                                        </div>
                                                        <div className="text-sm font-medium">Reschedule</div>
                                                    </button>
                                                </div>
                                                <div className="">
                                                    {/* Check if cancelled_at is null  */}
                                                    {item?.extendedProps?.cancelled_at === null && item?.extendedProps?.expired_at === null &&
                                                        <button
                                                            onClick={() => cancelModal(item.id)}
                                                            type="button"
                                                            className="g-primary-btn-transparent flex items-center space-x-3"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                                            </div>
                                                            <div className="text-sm font-medium">Cancel</div>
                                                        </button>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Add to Calendar */}
                                        <div className="px-4 py-2 sm:px-6">
                                            <div className="flex items-start justify-between space-x-1">
                                                <div className="space-y-1">
                                                    Add to your Calendar
                                                </div>
                                            </div>
                                            <div className="flex items-center pt-2">
                                                <a
                                                target='_blank'
                                                href={`https://calendar.google.com/calendar/r/eventedit?dates=${moment(item.extendedProps?.date_time).tz(item.extendedProps?.calendar_availability?.timezone).format('YYYYMMDDTHHmmss')}/${item.extendedProps && moment(item.extendedProps?.date_time).tz(item.extendedProps?.calendar_availability?.timezone).add(item?.extendedProps?.calendar?.duration, 'minutes').format('YYYYMMDDTHHmmss')}&text=${item?.extendedProps?.calendar?.name}%20between%20${user.name}%20and%20${item?.extendedProps?.invitee_name}&details=${getDescription(item)}&location=${getLocation(item.extendedProps?.location, item?.extendedProps?.invitee_phone)}`}
                                                >
                                                    <img src={googleCalendar} className="h-6 w-6 mr-1" alt="Google Calendar" />
                                                </a>
                                                <a target='_blank'
                                                    href={`https://outlook.live.com/calendar/0/deeplink/compose?body=${getDescription(item)}&enddt=${moment(item?.extendedProps?.date_time, item.extendedProps?.calendar_availability?.timezone).tz('utc').add(item?.extendedProps?.calendar.duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss')}Z&path=%252Fcalendar%252Faction%252Fcompose&rru=addevent&startdt=${moment(item?.extendedProps?.date_time, item.extendedProps?.calendar_availability?.timezone).tz('utc').format('YYYY-MM-DDTHH:mm:ss')}Z&subject=${item?.extendedProps?.calendar.name}%20between%20${user.name}%20and%20${item?.extendedProps?.invitee_name}`}>
                                                    <img src={outlookCalendar} className="h-6 w-6 mx-1" alt="Outlook Calendar" />
                                                </a>
                                                <a target='_blank'
                                                    href={`https://outlook.office.com/calendar/0/deeplink/compose?body=${getDescription(item)}&enddt=${moment(item?.extendedProps?.date_time, item.extendedProps?.calendar_availability?.timezone).tz('utc').add(item?.extendedProps?.calendar.duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss')}Z&path=%252Fcalendar%252Faction%252Fcompose&rru=addevent&startdt=${moment(item?.extendedProps?.date_time, item.extendedProps?.calendar_availability?.timezone).tz('utc').format('YYYY-MM-DDTHH:mm:ss')}Z&subject=${item?.extendedProps?.calendar.name}%20between%20${user.name}%20and%20${item?.extendedProps?.invitee_name}`}>
                                                    <img src={microsoftCalendar} className="h-6 w-6 mx-1" alt="Outlook Calendar" />
                                                </a>
                                                <a target='_blank'
                                                    href={`${apiEndpoint}/api/bookings/${item.id}/download-ics`}>
                                                    <img src={icsCalendar} className="h-6 w-6 mx-1" alt="Outlook Calendar" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pb-16 relative p-8 overflow-hidden">
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Calendar Information
                                                </h3>
                                                <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Date
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            <time dateTime="2020-01-07">
                                                                {moment(item?.extendedProps?.date).format("dddd, MMMM Do YYYY")}
                                                            </time>
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Time
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {item?.extendedProps?.start} - {item?.extendedProps?.end}
                                                            {/* {item.start} - {item.end} */}
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Duration
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {/* mins export */}
                                                            {item?.extendedProps?.duration} mins
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Calendar timezone
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {item?.extendedProps?.calendar_availability?.timezone}
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Created By
                                                        </dt>
                                                        <dd className="text-gray-900 capitalize">
                                                            {item?.extendedProps?.created_by}
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Created At
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {moment(item?.extendedProps?.created_at).format("ddd, DD MMM YY, h:mm A")}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Invitee Information
                                                </h3>
                                                <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Invitee Email
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {item?.extendedProps?.invitee_email}
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Invitee Timezone
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {item?.extendedProps?.timezone}
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Created By
                                                        </dt>
                                                        <dd className="text-gray-900 capitalize">
                                                            {item?.extendedProps?.created_by}
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-3 text-sm font-medium">
                                                        <dt className="text-gray-500">
                                                            Created At
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {moment(item?.extendedProps?.created_at).format("ddd, DD MMM YY, h:mm A")}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Location
                                                </h3>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <p className="text-sm italic text-gray-500">
                                                        {item?.extendedProps?.location ? <span>{displayLocation(item?.extendedProps?.location, item?.extendedProps?.invitee_phone)}</span> : <span className="italic text-gray-400">No location added by invitee</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            {item?.extendedProps?.invitee_notes && <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Meeting Notes
                                                </h3>
                                                <div className="mt-2 flex items-center justify-between">
                                                    {editingNoteModelId != item.id && <p className="text-sm italic text-gray-500">
                                                        <dd className="mt-1 text-sm text-gray-600">{item?.extendedProps?.meeting_notes ?? "(only the host will see these)"}</dd>
                                                    </p>}
                                                    {editingNoteModelId === item.id && <dd className="mr-2 text-sm text-gray-600 w-full">
                                                        <textarea
                                                            placeholder="Enter your note (only the host will see these)"
                                                            rows={3}
                                                            className="mt-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grandkit-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                                            defaultValue={item?.extendedProps?.meeting_notes}
                                                            onChange={(e) => setMeetingNote(e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => updateMeetingNote(item.id)}
                                                            className="mt-2 rounded bg-grandkit-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-grandkit-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                                                        >
                                                            Save
                                                        </button>
                                                    </dd>}
                                                    <button
                                                        onClick={() => setEditingNoteModelId(editingNoteModelId ? null : item.id)}
                                                        type="button"
                                                        className="-mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500"
                                                    >
                                                        <PencilIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="sr-only">
                                                            Add description
                                                        </span>
                                                    </button>
                                                </div>

                                            </div>}
                                            {item?.extendedProps?.invitee_notes && <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Invitee Notes
                                                </h3>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <p className="text-sm italic text-gray-500">
                                                        {item?.extendedProps?.invitee_notes}
                                                    </p>
                                                </div>
                                            </div>}
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Other Invited by invitee
                                                </h3>
                                                {item?.extendedProps?.other_invitees ?<ul
                                                    role="list"
                                                    className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200"
                                                >
                                                    {item?.extendedProps?.other_invitees.split(',').map((invitee, inviteeIndex) => ( <li className="flex items-center justify-between py-3">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={avatar}
                                                                alt=""
                                                                className="h-8 w-8 rounded-full"
                                                            />
                                                            <p className="ml-4 text-sm font-medium text-gray-900">
                                                                {invitee}
                                                            </p>
                                                        </div>
                                                    </li>))}
                                                </ul> : <span className="italic text-gray-400 text-sm">No other invitees</span>}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                    <AlertModal
                        title="Cancel booking"
                        note={`Are you sure you want to cancel this booking?`}
                        confirm={confirmCancelModel}
                        close={() => setCancelModelModalOpen(false)}
                        open={cancelModelModalOpen}
                    />

                    <AlertModalSuccess
                        title="Confirm booking"
                        note={`Are you sure you want to confirm this booking?`}
                        confirm={confirmBookingModal}
                        close={() => setConfirmModelModalOpen(false)}
                        open={confirmModelModalOpen}
                    />
                </div>
            </Dialog>
        </Transition.Root>
    );
}
