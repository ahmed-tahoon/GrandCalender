import { useEffect, useState } from "react";
import Pagination from "components/common/Pagination";
import List from "components/features/calendars/List";
import SectionHeading from "components/features/calendars/SectionHeading";
import AppLayout from "layouts/AppLayout";
import {
    ClockIcon,
    UserIcon,
    BookmarkIcon,
} from "@heroicons/react/20/solid";
import { ExclamationCircleIcon, FolderMinusIcon, CalendarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import SideBar from "components/features/settings/SideBar";
import { Link, useLoaderData } from "react-router-dom";
import axios from 'axios';
import State from "components/widgets/State";
import moment from "moment-timezone";

export default function Root() {
    const { user } = useLoaderData();
    const [isLoaded, setIsLoaded] = useState(false);
    const [dashboard, setDashboard] = useState([]);
    const [todayBookings, setTodayBookings] = useState([]);
    const [thisweekBookings, setThisweekBookings] = useState([]);
    const [stats, setStats] = useState([
        { name: "Upcoming Bookings", stat: "0", route: "/dashboard/bookings", icon: CalendarDaysIcon },
        { name: "Total Pending Confirmation", stat: "0", route: "/dashboard/bookings?collection=pending", icon: ExclamationCircleIcon },
        { name: "Total Calendars", total: "0", stat: "0", twice: true, route: "/dashboard/calendars", icon: CalendarIcon },
    ]);

    // Load dashboard data
    const loadDashboardData = async () => {
        try {
            const response = await axios.get("/api/dashboard");
            setIsLoaded(true);
            setDashboard(response.data);
            setTodayBookings(response.data.today_bookings)
            setThisweekBookings(response.data.this_week_bookings)
            // Update stats data state
            setStats([
                { name: "Upcoming Bookings", stat: response.data.total_bookings ?? 0, route: "/dashboard/bookings", icon: CalendarDaysIcon  },
                { name: "Total Pending Confirmation", stat: response.data.total_pending_bookings ?? 0, route: "/dashboard/bookings?collection=pending", icon: ExclamationCircleIcon },
                { name: "Total Calendars", total: response.data.total_calendars, stat: response.data.total_active_calendars ?? 0, state2: response.data.total_deactivated_calendars ?? 0, twice: true, route: "/dashboard/calendars", icon: CalendarIcon },
            ]);

        } catch (error) {
            console.log(error);
        }
    };
    
    const dayINeed = 4; // for Thursday
    let end;
        // if we haven't yet passed the day of the week that I need:
    if (moment().isoWeekday() <= dayINeed) {
        // then just give me this week's instance of that day
        end =  moment().isoWeekday(dayINeed);
    } else {
        // otherwise, give me next week's instance of that day
        end = moment().add(1, 'weeks').isoWeekday(dayINeed);
    }


    // ?date_range=2023-06-15:2023-06-15
    const dateRangeToday = moment().format("YYYY-MM-DD") + ":" + moment().format("YYYY-MM-DD");

    // Date range from now to next Thursday
    const dateRangeThisWeek = moment().format("YYYY-MM-DD") + ":" + moment(end).format("YYYY-MM-DD");

    // Set page title
    useEffect(() => {
        document.title = "Dashboard";
        loadDashboardData();
    }, []);

    return (
        <AppLayout
            user={user}
            sideBar={<SideBar />}
            sideBarStatus={false}
            layoutType="many_left_blocks"
        >
            <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {stats.map((item) => (
                        <State
                            twice={item.twice ?? false}
                            label={item.name ?? "Loading..."}
                            value={item.stat ?? "Loading..."}
                            value2={item.state2 ?? "Loading..."}
                            total={item.total ?? "Loading..."}
                            link={item.route ?? "/dashboard"}
                            icon={item.icon ?? CalendarIcon}
                        />
                    ))}
                </dl>
                <div className="mt-8 flow-root grid grid-cols-2 gap-5">
                    <div className="bg-white pt-4 rounded-lg shadow-md relative pb-14">
                        <h3 className="font-medium border-b px-6 pb-1.5">
                            Today Bookings
                        </h3>
                        <ul role="list" className="divide-y divide-gray-100">
                            {todayBookings.length > 0 ? todayBookings.map((item) => (
                                <li key={item.id} className="relative px-6 py-5 cursor-pointer hover:bg-gray-50 last:rounded-b-md">
                                    <Link to={`/dashboard/bookings?booking_id=${item.id}`} className="">
                                        <div className="flex items-center gap-x-2">
                                            {item?.calendar?.color && <div
                                                className={`ml-1 rtl:ml-1 flex-shrink-0 h-3 w-3 rounded-full`}
                                                style={{ backgroundColor: item?.calendar?.color }}
                                            />}
                                            <p
                                                className={`truncate text-sm font-medium text-grandkit-600 capitalize flex-auto truncate text-sm font-semibold leading-6`}
                                                style={{
                                                    color: item?.calendar?.color,
                                                }}
                                            >
                                                {item.date}
                                                {item.cancelled_at !== null && item.expired_at === null && <span className="ml-2 rtl:mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>}
                                                {!item.is_confirmed && item.cancelled_at === null && !item.is_past && <span className="mx-1 inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-500">Waiting for confirmation</span>}
                                                {item.is_confirmed && item.cancelled_at === null && item.is_past && <span className="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">Confirmed</span>}
                                                {item.cancelled_at !== null && item.is_past && <span className="mx-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>}
                                                {item.rescheduled_at !== null && <span className="mx-1 inline-flex items-center rounded-full bg-yellow-50 px-3 py-0.5 text-xs font-medium text-yellow-800">Rescheduled</span>}
                                            </p>
                                            <time
                                                dateTime={item.dateTime}
                                                className="flex-none text-xs text-gray-500"
                                            >
                                                {item.duration} mins
                                            </time>
                                        </div>
                                        <p className="grid grid-rows-3 lg:grid-cols-2 xl:flex xl:items-center mt-3 gap-2 truncate text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <ClockIcon
                                                className="h-5 w-5 flex-shrink-0 text-gray-400 mr-1"
                                                aria-hidden="true"
                                            />
                                            {item.start} - {item.end}
                                        </div>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <CalendarDaysIcon
                                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            {item.calendar.name}
                                        </p>
                                        <p className="flex items-center text-sm text-gray-500">
                                            <UserIcon
                                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span className="ml-1.5">
                                                {item.invitee_name}
                                            </span>
                                        </p>
                                        </p>
                                    </Link>
                                </li>
                            )): (
                                // No Active Booking
                                <div className="text-center my-6">
                                <FolderMinusIcon className="mx-auto h-8 w-8 text-gray-400"
                                                aria-hidden="true" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Bookings</h3>
                            </div>
                            )}
                        </ul>
                        <Link
                            to={'/dashboard/bookings?date_range=' + dateRangeToday}
                            className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-md absolute inset-x-0 bottom-0">
                            <div className="text-sm text-center">
                                <div
                                    // ?date_range=2023-06-15%3A2023-06-15 Today
                                    className="font-medium text-grandkit-600 hover:text-grandkit-500"
                                >
                                    View More
                                    <span className="sr-only"> Label stats</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="bg-white pt-4 rounded-lg shadow-md relative pb-14">
                        <h3 className="font-medium border-b px-6 pb-1.5">
                            This Week Bookings
                        </h3>
                        <ul role="list" className="divide-y divide-gray-100">
                            {thisweekBookings.length > 0  ? thisweekBookings.map((item) => (
                                <li key={item.id} className="relative px-6 py-5 cursor-pointer hover:bg-gray-50 last:rounded-b-md">
                                    <Link to={`/dashboard/bookings?booking_id=${item.id}`} className="">
                                    <div className="flex items-center gap-x-2">
                                        {item?.calendar?.color && <div
                                            className={`ml-1 rtl:ml-1 flex-shrink-0 h-3 w-3 rounded-full`}
                                            style={{ backgroundColor: item?.calendar?.color }}
                                        />}
                                        <p
                                            className={`text-grandkit-600 capitalize flex-auto truncate text-sm font-semibold leading-6`}
                                            style={{
                                                color: item?.calendar?.color,
                                            }}
                                        >
                                            {item.date}
                                            {item.cancelled_at !== null && item.expired_at === null && <span className="ml-2 rtl:mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>}
                                            {!item.is_confirmed && item.cancelled_at === null && !item.is_past && <span className="mx-1 inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-500">Waiting for confirmation</span>}
                                            {item.is_confirmed && item.cancelled_at === null && item.is_past && <span className="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">Confirmed</span>}
                                            {item.cancelled_at !== null && item.is_past && <span className="mx-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>}
                                            {item.rescheduled_at !== null && <span className="mx-1 inline-flex items-center rounded-full bg-yellow-50 px-3 py-0.5 text-xs font-medium text-yellow-800">Rescheduled</span>}
                                        </p>
                                        <time
                                            dateTime={item.dateTime}
                                            className="flex-none text-xs text-gray-500"
                                        >
                                            {item.duration} mins
                                        </time>
                                    </div>
                                    <p className="grid grid-rows-3 lg:grid-cols-2 xl:flex xl:items-center mt-3 gap-2 truncate text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <ClockIcon
                                                className="h-5 w-5 flex-shrink-0 text-gray-400 mr-1"
                                                aria-hidden="true"
                                            />
                                            {item.start} - {item.end}
                                        </div>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <CalendarDaysIcon
                                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            {item.calendar.name}
                                        </p>
                                        <p className="flex items-center text-sm text-gray-500">
                                            <UserIcon
                                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span className="ml-1.5">
                                                {item.invitee_name}
                                            </span>
                                        </p>
                                    </p>
                                    </Link>
                                </li>
                            )) : (
                                // No Active Booking
                                <div className="text-center my-6">
                                <FolderMinusIcon className="mx-auto h-8 w-8 text-gray-400"
                                                aria-hidden="true" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Bookings</h3>
                            </div>
                            )}
                        </ul>
                        <Link
                            to={'/dashboard/bookings?date_range=' + dateRangeThisWeek}
                            className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-md absolute inset-x-0 bottom-0">
                            <div className="text-sm text-center">
                                <div
                                    className="font-medium text-grandkit-600 hover:text-grandkit-500"
                                >
                                    View More
                                    <span className="sr-only"> Label stats</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
