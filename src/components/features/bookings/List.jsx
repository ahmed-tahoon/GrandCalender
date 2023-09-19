import { ClockIcon, UserIcon, EyeIcon, ChevronRightIcon, CalendarDaysIcon, ChevronDownIcon, ArrowPathIcon, TrashIcon, ArrowRightOnRectangleIcon, FunnelIcon, PencilIcon, CheckIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import Pagination from 'components/common/NumberPagination';
import SkeletonTable from 'components/common/SkeletonTable';
import DropdownButton from './DropdownButton'
import axios from 'axios';
import AlertModal from 'components/common/AlertModal';
import AlertModalSuccess from 'components/common/AlertModalSuccess';
import { toast } from 'react-toastify';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react'
import Tabs from "components/features/bookings/Tabs";
import CalendarView from "components/features/bookings/CalendarView";
import Bookings from 'features/Bookings/List';
import moment from 'moment-timezone';
import bookingUrl from "utils/bookingUrl";
import googleCalendar from 'assets/google-calendar.svg';
import outlookCalendar from 'assets/outlook-calendar.svg';
import microsoftCalendar from 'assets/microsoft-calendar.svg';
import icsCalendar from 'assets/ics-calendar.png';
import googleMeetSVG from 'assets/integrations/google-meet.svg';
import zoomSVG from 'assets/integrations/zoom.svg';

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function List({user}) {
    const [isLoaded, setIsLoaded] = useState(false);
    let [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [booking, setBooking] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState([]);
    const [viewingModelId, setViewingModelId] = useState(null)
    const [editingNoteModelId, setEditingNoteModelId] = useState(null)
    const [cancelModelId, setCancelModelId] = useState(null)
    const [cancelModelModalOpen, setCancelModelModalOpen] = useState(false)
    const [confirmModelId, setConfirmModelId] = useState(null)
    const [confirmModelModalOpen, setConfirmModelModalOpen] = useState(false)
    const [meetingNote, setMeetingNote] = useState('')
    const [cancelModelReason, setCancelModelReason] = useState('')
    const [searchQuery, setSearchQuery] = useState(null)
    const navigate = useNavigate();

    function loadItems(params = {}) {
        setSearchParams(params)

        axios.get("/api/bookings", {
                params: params,
            })
            .then(function (response) {
                // handle success
                setIsLoaded(true)
                setItems(response.data.data);
                setPaginationMeta(response.data.meta);
                setMeetingNote(response.data.data.meeting_notes)
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

    const getBooking = async () => {
        try {
            const response = await axios.get(`/api/bookings/${searchParams.get('trigger_cancel')}/booking-uid`)
            if (response.data.status === 'success') {
                if (response.data.data.is_past || response.data.data.cancelled_at) {
                    toast.error('Booking already cancelled')
                    return
                }
                cancelModal(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Set page title
    useEffect(() => {
        refreshItems()
        if (searchParams.get('booking_id')) {
            // Smooth scroll to the top of the accordion in useEffect after render
            setTimeout(() => {
                const el = document.getElementById('booking-'+searchParams.get('booking_id'));
                el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }, 500);
        }

        if (searchParams.get('trigger_cancel')) {
            getBooking()
        }
    }, []);



    // Filters
    const [filterCount, setFilterCount] = useState(0)
    const [filterCollection, setFilterCollection] = useState(searchParams.get('collection') ? searchParams.get('collection') : '')
    const [filterCalendarId, setFilterCalendarId] = useState(searchParams.get('calendar_id') ? searchParams.get('calendar_id') : '')
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') ? searchParams.get('status') : '')
    const [filterDateRange, setFilterDateRange] = useState(searchParams.get('date_range') ? searchParams.get('date_range') : '')
    const [filterView, setFilterView] = useState(searchParams.get('view') ? searchParams.get('view') : 'list')

    function clearFilter() {
        // don't remove view from url
        let params = {
            view: filterView
        };
        setFilterCollection('')
        setFilterCalendarId('')
        setFilterStatus('')
        setFilterDateRange('')
        loadItems(params)
    }

    function addFilter(key, value) {
        // Close accordion
        setViewingModelId(null)
        switch(key) {
        case 'collection':
            setFilterCollection(value)
            setFilterCount((filterCount) => filterCount + 1)
            break;
        case 'calendar_id':
            setFilterCalendarId(value)
            setFilterCount((filterCount) => filterCount + 1)
            break;
        case 'status':
            setFilterStatus(value)
            setFilterCount((filterCount) => filterCount + 1)
            break;
        case 'date_range':
            setFilterDateRange(value)
            setFilterCount((filterCount) => filterCount + 1)
            break;
            case 'view':
            // Remote date range filter if value is calendar
            if (value !== 'list') {
                setFilterDateRange('')
                // remove date_range from url
                searchParams.delete('date_range');
            }
            setFilterView(value)
            setFilterCount((filterCount) => filterCount + 1)
            break;
        }
        reloadItems(key, value)
    }

    // Event handlers for fullcalendar {title, date}
    /**
     * Return events array for fullcalendar from bookings array
     * @param {bookings} bookings
     * @returns {events} events [{title, date}]
     */
    const handleDateClick = (bookings) => {
        let events = [];
        bookings.forEach(booking => {
            events.push({
                id: booking.id,
                title: booking.invitee_name,
                date: booking.date_time,
                borderColor: booking.calendar.color,
                backgroundColor: booking.calendar.color,
                groupId: booking.calendar.id,
                start: booking.date_time,
                end: moment(booking.date_time).add(booking.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                className: `cursor-pointer ${booking.is_past || booking.cancelled_at !== null ? '!line-through' : ''}`,
                extendedProps: {
                    ...booking
                }
            })
        });
        return events;
    }

    function cancelModal(item) {
        setCancelModelId(item.id)
        setBooking(item)
        setCancelModelModalOpen(true)
    }

    // cancel model
    function confirmCancelModel() {
        const formData = new FormData();
        formData.append('reason', cancelModelReason);
        formData.append('cancelled_by', 'host');

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
                setCancelModelId(null)
                setCancelModelModalOpen(false)
                refreshItems()
            })
            .catch(function (error) {
            });
    }

    function confirmModal(item) {
        setBooking(item)
        setConfirmModelId(item.id)
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
                refreshItems()
            })
            .catch(function (error) {
            });
    }

    const toggleAccordion = (id) => {
        setViewingModelId(id)
        // keep old params and add new one to url
        searchParams.set('booking_id', id);
        navigate(`/dashboard/bookings?${searchParams.toString()}`, { replace: true });
        // Smooth scroll to the top of the accordion
        if (id) {
            const el = document.getElementById('booking-' + id);
            // and check if user is already on top of the accordion to prevent scroll
            // Calculate the offset of the element from the top of the page
            const offsetTop = el.getBoundingClientRect().top + window.pageYOffset;
            if (offsetTop > 0) {
                el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }



        }
    };

    const hostReschedule = async (item) => {
        const payload = {
            type: 'host'
        }
        try {
            const response = await axios.post(`/api/bookings/${item.id}/reschedule`, payload);
            if (response.data.status === 'success') {
                window.open(`${bookingUrl(user.username, item.calendar.slug)}/${response.data.data.reschedule_uuid}/reschedule?type=host&date=${moment(item.date_time).format('YYYY-MM-DD')}&token=${response.data.token}`, '_blank');
            }
        } catch (error) {
            console.log(error);
        }
    }

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
            refreshItems()
        } catch (error) {
            console.log(error);
        }
    }

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
        const eventName = `Event Name: ${booking.calendar?.name}`
        const eventDate = `Event Date: ${moment(booking.date_time).tz(booking.calendar_availability.timezone).format('dddd, MMMM DD, YYYY')} at ${moment(booking.date_time).tz(booking.calendar_availability.timezone).format('h:mm A')} - ${moment(booking.date_time).tz(booking.calendar_availability.timezone).add(booking.duration, 'minutes').format('h:mm A')}`
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

    const cancelNote = () => {
        if (!booking) {
            return  'Are you sure you want to cancel this booking?'
        }

        return `
            <div class="text-gray-900">
                <ul class='py-6 list-disc list-inside'>
                    <li>
                        ${booking.calendar?.name}
                    </li>
                    <li class="font-semibold">
                        ${booking.invitee_name}
                    </li>
                    <li>
                        ${booking.start} - ${booking.end}
                    </li>
                </ul>
                <div class='text-gray-600'>
                    Please confirm that you would like to cancel this event. A cancellation email will also go out to the invitee.
                </div>
            </div>
        `
    }


    return (
        <div>
            <Tabs
                clearFilter={clearFilter}
                addFilter={addFilter}
                filterCollection={filterCollection}
                filterCalendarId={filterCalendarId}
                filterStatus={filterStatus}
                filterDateRange={filterDateRange}
                setFilterDateRange={setFilterDateRange}
                filterView={filterView}
                user={user}
            />

            {isLoaded && searchParams.get('view') !== 'calendar' && <ul role="list" className="divide-y divide-gray-200">
                {items.map((item) => (
                <li key={item.id}>
                    <div className={(viewingModelId === item.id ? 'bg-gray-50' : '')+" cursor-pointer hover:bg-gray-50 flex justify-between items-center"} onClick={() => toggleAccordion(viewingModelId === item.id ? null : item.id)} id={'booking-'+item.id} >
                        <div className="px-4 py-4 sm:px-6 w-full">
                                <div className="flex items-center ">
                                {item.calendar?.color && <div className={`ml-1 mr-2 rtl:ml-2 flex-shrink-0 h-3 w-3 rounded-full`} style={{backgroundColor: item?.calendar?.color}} />}
                                <p className={`truncate text-sm font-medium text-grandkit-600 capitalize`} style={{color: item.calendar.color}}>
                                        <button onClick={() => toggleAccordion(item.id)}>
                                            {item.date}
                                            {
                                                item.cancelled_at !== null && item.expired_at === null &&
                                             <span className="ml-2 rtl:mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>}
                                        </button>
                                </p>
                                <div className="">
                                        {!item.is_confirmed && item.cancelled_at === null && !item.is_past && <span className="mx-1 inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-500">Waiting for confirmation</span>}
                                        {item.is_confirmed && item.cancelled_at === null && <span className="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">Confirmed</span>}
                                        {item.expired_at !== null && item.is_past && <span className="mx-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>}
                                        {item.rescheduled_at !== null && <span className="mx-1 inline-flex items-center rounded-full bg-yellow-50 px-3 py-0.5 text-xs font-medium text-yellow-800">Rescheduled</span>}
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex space-s-6">
                                    <p className="flex items-center text-sm text-gray-500 space-s-1.5">
                                        <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mr-1" aria-hidden="true" />
                                            ({ item.duration } mins)<span>{item.start} - {item.end}</span>
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <CalendarDaysIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        {item.calendar.name} {item.calendar.deleted_at && <span className="text-red-800 text-xs mx-1">(Calendar Deleted)</span>}
                                    </p>
                                    <p className="flex items-center text-sm text-gray-500 space-s-1.5">
                                        <UserIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <span>{item.invitee_name}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="pr-2 rtl:pl-2">
                            {(viewingModelId === item.id) ? <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> : <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                        </div>
                    </div>
                    <Transition
                        show={item.id == searchParams.get('booking_id') || item.id === viewingModelId }
                        enter="transition-opacity duration-150"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="border-t px-3">
                            <div className="mx-auto max-w-3xl xl:grid xl:max-w-5xl xl:grid-cols-3">
                                <aside className="hidden xl:block xl:pr-8 rtl:pl-8 py-6">
                                    <h2 className="sr-only">Details</h2>
                                    <div className="space-y-3">
                                        {!item.is_confirmed && item.cancelled_at === null && !item.is_past && <div className="">
                                            <button
                                                    onClick={() => confirmModal(item)}
                                                type="button"
                                                className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700"
                                            >
                                                <div className="flex-shrink-0">
                                                    <CheckIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                </div>
                                                <div className="text-sm font-medium">Confirm booking</div>
                                            </button>
                                        </div>}
                                        <div className="">
                                                {!item.calendar.deleted_at && <div
                                                    onClick={() => hostReschedule(item)}
                                                    className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700 cursor-pointer"
                                                >
                                                    <div className="flex-shrink-0">
                                                        <ArrowPathIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                    </div>
                                                    <div className="text-sm font-medium">Reschedule</div>
                                                </div>}
                                        </div>
                                        <div className="">
                                            {/* Check if cancelled_at is null  */}
                                            {item.cancelled_at === null && item.expired_at === null &&
                                                <button
                                                    onClick={() => cancelModal(item)}
                                                    type="button"
                                                    className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700"
                                                >
                                                    <div className="flex-shrink-0">
                                                        <TrashIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                    </div>
                                                    <div className="text-sm font-medium">Cancel</div>
                                                </button>}
                                        </div>
                                    </div>

                                    {/* Prev booking after reschedule  */}
                                    {item.cancelled_at && <div>
                                        <hr className="border-gray-200 my-4" aria-hidden="true" />
                                            <h3 className="text-sm font-medium text-red-800">Cancelled</h3>
                                            <dl className="mt-2 text-xs">
                                                <div className="text-xs text-gray-500 italic">On: {moment(item.cancelled_at).format('DD/MM/YYYY')}</div>
                                                <div className="text-xs text-gray-500 italic">By: {item.cancelled_by}</div>
                                                {item.cancellation_reason &&
                                                    <div className="text-xs text-gray-500 italic">Reason: {item.cancellation_reason}</div>
                                                }
                                            </dl>
                                        </div>}


                                    {item.rescheduled_at && <div>
                                            <hr className="border-gray-200 my-6" aria-hidden="true" />
                                            <h3 className="text-sm font-medium text-yellow-800">Rescheduled</h3>
                                            <dl className="mt-2 text-xs text-yellow-800">
                                                {/* Reschedule prev data item.reschedule_data (array) */}
                                                {item.reschedule_data &&
                                                    <div className="text-xs text-gray-500 italic">Rescheduled from {moment(item.date_time).format("Do [of] MMMM YYYY [at] h:mm A")} ({item.calendar.duration} mins)
                                                    on {moment(item.rescheduled_at).format("Do [of] MMMM YYYY [at] h:mm A")}
                                                        <div>By: { item.rescheduled_by }</div>
                                                        {item.reschedule_reason && <div>Reason: { item.reschedule_reason }</div>}
                                                    </div>
                                                }
                                            </dl>
                                    </div>}
                                    {/* <div className="mt-6 space-y-8 border-t border-gray-200 py-6">
                                        <div>
                                            <ul role="list" className="mt-3 space-y-3">
                                                <li className="flex justify-start">
                                                    <Link to="" className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700">
                                                        <div className="flex-shrink-0">
                                                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                        </div>
                                                        <div className="text-sm font-medium">Edit Calendar</div>
                                                    </Link>
                                                </li>
                                                <li className="flex justify-start">
                                                    <Link to="" className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700">
                                                        <div className="flex-shrink-0">
                                                            <FunnelIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                        </div>
                                                        <div className="text-sm font-medium">Filter by Calendar</div>
                                                    </Link>
                                                </li>
                                                <li className="flex justify-start">
                                                    <Link to="" className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700">
                                                        <div className="flex-shrink-0">
                                                            <ClockIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                        </div>
                                                        <div className="text-sm font-medium">Change time</div>
                                                    </Link>
                                                </li>
                                                <li className="flex justify-start">
                                                    <Link to="" className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700">
                                                        <div className="flex-shrink-0">
                                                            <ArrowPathIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                        </div>
                                                        <div className="text-sm font-medium">Reschedule</div>
                                                    </Link>
                                                </li>

                                                <li className="flex justify-start">
                                                    <Link to="" className="flex items-center space-x-3 text-grandkit-600 hover:text-grandkit-700">
                                                        <div className="flex-shrink-0">
                                                            <TrashIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                                                        </div>
                                                        <div className="text-sm font-medium">Cancel</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </aside>

                                <div className="xl:col-span-2 xl:border-l rtl:xl:border-r xl:border-gray-200 xl:pl-8 rtl:xl:pr-8">
                                    <div className="py-6 divide-y space-y-4">
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-4">
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Created on</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.created_at}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.created_by}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500 flex items-center space-s-2">
                                                    <span>Meeting Notes</span>

                                                    <button onClick={() => setEditingNoteModelId(editingNoteModelId ? null : item.id)} className="rounded-full bg-transparent p-1 text-grandkit-600 hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600">
                                                        <PencilIcon className="h-3 w-3" aria-hidden="true" />
                                                    </button>


                                                </dt>

                                                    {editingNoteModelId === item.id && <dd className="mt-1 text-sm text-gray-600">
                                                    <textarea
                                                        placeholder="Enter your note (only the host will see these)"
                                                        rows={3}
                                                        className="mt-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grandkit-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                                        defaultValue={item.meeting_notes}
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
                                                    {editingNoteModelId != item.id && <dd className="mt-1 text-sm text-gray-600">{item.meeting_notes ?? "(only the host will see these)"}</dd>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Calendar timezone</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.calendar_availability.timezone}</dd>
                                            </div>
                                        </dl>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-4 pt-4">
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Invite email</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.invitee_email ?? 'N/A'}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Invitee timezone</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.timezone}</dd>
                                            </div>
                                            <div className="sm:col-span-4">
                                                <dt className="text-sm font-medium text-gray-500">Invitee Notes</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.invitee_notes ?? 'N/A'}</dd>
                                            </div>
                                            <div className="sm:col-span-4">
                                                <dt className="text-sm font-medium text-gray-500">How you will meet?</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.location ? <span>{displayLocation(item.location, item.invitee_phone)}</span> : <span className="italic text-gray-400">No location has been specified</span>}</dd>
                                                </div>
                                            {/* <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Invite phone</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{item.invitee_phone ?? 'N/A'}</dd>
                                            </div> */}
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Other Invited by invitee</dt>
                                                    <dd className="mt-1 text-sm text-gray-600 italic">{item.other_invitees || <span className="italic">No one else is invited</span>}</dd>
                                            </div>
                                            <div className="sm:col-span-4">
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                        <div className="w-full border-t border-gray-300" />
                                                    </div>
                                                    <div className="relative flex justify-center">
                                                        <span className="bg-white px-2 text-sm text-gray-500">Add to your calendar</span>
                                                    </div>
                                                </div>
                                                <dd className="mt-4 text-sm text-gray-600 italic">
                                                    <div className="flex items-center justify-center">
                                                        <a
                                                        target='_blank'
                                                        href={`https://calendar.google.com/calendar/r/eventedit?dates=${moment(item.date_time).tz(item.calendar_availability.timezone).format('YYYYMMDDTHHmmss')}/${moment(item.date_time).tz(item.calendar_availability.timezone).add(item.calendar.duration, 'minutes').format('YYYYMMDDTHHmmss')}&text=${item.calendar.name}%20between%20${user.name}%20and%20${item.invitee_name}&details=${getDescription(item)}&location=${getLocation(item.location, item.invitee_phone)}`}
                                                        >
                                                            <img src={googleCalendar} className="h-6 w-6 mx-1" alt="Google Calendar" />
                                                        </a>
                                                        <a target='_blank'
                                                            href={`https://outlook.live.com/calendar/0/deeplink/compose?body=${getDescription(item)}&enddt=${moment(item.date_time, item.calendar_availability.timezone).tz('utc').add(item.calendar.duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss')}Z&path=%252Fcalendar%252Faction%252Fcompose&rru=addevent&startdt=${moment(item.date_time, item.calendar_availability.timezone).tz('utc').format('YYYY-MM-DDTHH:mm:ss')}Z&subject=${item.calendar.name}%20between%20${user.name}%20and%20${item.invitee_name}`}>
                                                            <img src={outlookCalendar} className="h-6 w-6 mx-1" alt="Outlook Calendar" />
                                                        </a>
                                                        <a target='_blank'
                                                            href={`https://outlook.office.com/calendar/0/deeplink/compose?body=${getDescription(item)}&enddt=${moment(item.date_time, item.calendar_availability.timezone).tz('utc').add(item.calendar.duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss')}Z&path=%252Fcalendar%252Faction%252Fcompose&rru=addevent&startdt=${moment(item.date_time, item.calendar_availability.timezone).tz('utc').format('YYYY-MM-DDTHH:mm:ss')}Z&subject=${item.calendar.name}%20between%20${user.name}%20and%20${item.invitee_name}`}>
                                                            <img src={microsoftCalendar} className="h-6 w-6 mx-1" alt="Outlook Calendar" />
                                                        </a>
                                                        <a target='_blank'
                                                            href={`${apiEndpoint}/api/bookings/${item.id}/download-ics`}>
                                                            <img src={icsCalendar} className="h-6 w-6 mx-1" alt="Outlook Calendar" />
                                                        </a>
                                                    </div>
                                                </dd>
                                            </div>
                                        </dl>
                                        {item.additional_answers.length > 0 && <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-4 pt-4">
                                            <h4 className="font-medium sm:col-span-4 -mb-4 text-sm">Additional questions</h4>
                                            {item.additional_answers.map((answer, answerIndex) => (<div className="sm:col-span-2" key={answerIndex}>
                                                <dt className="text-sm font-medium text-gray-500">{answer.label}</dt>
                                                <dd className="mt-1 text-sm text-gray-600">{answer.value ?? 'N/A'}</dd>
                                            </div>))}
                                        </dl>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </li>
                ))}
            </ul>}

            {!isLoaded && <SkeletonTable rows={3} />}

            {/* Pagination */}
            {(items.length > 0 && isLoaded) && searchParams.get('view') !== 'calendar' && (
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
                <p className="mt-1 text-sm text-gray-500">No booking</p>
            </div>)}

            <AlertModal
                title="Cancel booking"
                note={cancelNote()}
                confirm={confirmCancelModel}
                close={() => setCancelModelModalOpen(false)}
                open={cancelModelModalOpen}
                prompt={
                    {
                        placeholder: 'Enter reason',
                        value: cancelModelReason,
                        type: 'text',
                        onChange: (e) => setCancelModelReason(e)
                    }
                }
            />

            <AlertModalSuccess
                title="Confirm booking"
                note={`Are you sure you want to confirm this booking?`}
                confirm={confirmBookingModal}
                close={() => setConfirmModelModalOpen(false)}
                open={confirmModelModalOpen}
            />
            { isLoaded && searchParams.get('view') === 'calendar' && (
                <CalendarView events={handleDateClick(items)} user={user} reloadItems={() => reloadItems()} />)}
        </div>
    )
}
