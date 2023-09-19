import { useEffect, useState, Fragment } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { Transition, Listbox } from "@headlessui/react";
import axios from "axios";
import bookingUrl from "utils/bookingUrl";
import { Link, useSearchParams } from 'react-router-dom';
import { CheckIcon, ChevronUpDownIcon, PlusCircleIcon, ListBulletIcon, CalendarDaysIcon } from "@heroicons/react/20/solid";
const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

const tabs = [
    { status: "", name: "Upcoming" },
    { status: "pending", name: "Pending" },
    { status: "past", name: "Past" },
    { status: "cancelled", name: "Cancelled / Expired" },
];

export default function Tabs({
    clearFilter,
    addFilter,
    filterCollection,
    filterCalendarId,
    filterStatus,
    filterDateRange,
    setFilterDateRange,
    filterView,
    user,
}) {
    let [searchParams, setSearchParams] = useSearchParams();
    const location = window.location.pathname;
    const [isFiltersOpen, setIsFilterOpen] = useState(true);
    const [calendars, setCalendars] = useState([]);
    const [dateRangeValue, setDateRangeValue] = useState(
        filterDateRange
            ? {
                  startDate: filterDateRange.substring(
                      0,
                      filterDateRange.indexOf(":")
                  ),
                  endDate: filterDateRange.slice(
                      filterDateRange.indexOf(":") + 1
                  ),
              }
            : { startDate: null, endDate: null }
    );


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

    function loadCalendars(params = {}) {
        axios
            .get("/api/calendars?type=select", {
                params: params,
            })
            .then(function (response) {
                // handle success
                setCalendars(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        loadCalendars();
    }, []);

    useEffect(() => {
        setDateRangeValue(
            filterDateRange
                ? {
                      startDate: filterDateRange.substring(
                          0,
                          filterDateRange.indexOf(":")
                      ),
                      endDate: filterDateRange.slice(
                          filterDateRange.indexOf(":") + 1
                      ),
                  }
                : { startDate: null, endDate: null }
        );
    }, [filterDateRange]);

    function handleDateRangeChange(dateRange) {
        if (!dateRange.startDate || !dateRange.endDate) {
            setFilterDateRange("");
            addFilter("date_range", "");
        } else {
            addFilter(
                "date_range",
                dateRange.startDate + ":" + dateRange.endDate
            );
        }
    }

    return (
        <div className="-mt-4 mb-4">
            <div className="border-b border-gray-200 flex justify-between items-center">
                <nav className="-mb-px flex space-s-8" aria-label="Tabs">
                    {tabs.map((tab, tabIndex) => (
                        <button
                            key={tabIndex}
                            onClick={() => addFilter("collection", tab.status)}
                            className={classNames(
                                filterCollection === tab.status
                                    ? "border-grandkit-500 text-grandkit-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                            aria-current={
                                filterCollection === tab.status
                                    ? "page"
                                    : undefined
                            }
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>

                <div>
                    {/* Calendar View with old query string */}
                    {<button
                        className="g-primary-btn-transparent mr-2"
                        onClick={() => addFilter("view", searchParams.get("view") === "calendar" ? "list" : "calendar")}
                    >
                        {
                            searchParams.get("view") === "calendar" ? <ListBulletIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" /> : <CalendarDaysIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                        }
                        {searchParams.get("view") === "calendar" ? "List View" : "Calendar View"}
                    </button>}
                    {/* Book Invitee Link */}
                    <Link
                        to={`${bookingUrl(user.username)}?type=host`}
                        target="_blank"
                        className="g-primary-btn-transparent"
                    >
                        <PlusCircleIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />
                        Book Invitee
                    </Link>
                </div>

                {/* <button
                    onClick={() => setIsFilterOpen(!isFiltersOpen)}
                    type="button"
                    className="flex justify-between items-center rounded-md bg-transparent px-2 py-1 text-sm text-grandkit-600 hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                >
                    {isFiltersOpen ? <XMarkIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" /> : <FunnelIcon className="h-4 w-4 mr-1 rtl:ml-1" aria-hidden="true" />}
                    {isFiltersOpen ? 'Close' : 'Filter'}
                </button> */}
            </div>

            <Transition
                show={isFiltersOpen}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="flex justify-start items-center border-b">
                    <div className="flex justify-start py-3 space-s-4 w-full">
                        <div className="w-full">
                            <label
                                htmlFor="location"
                                className="sr-only block text-sm font-medium leading-6 text-gray-900"
                            >
                                Calendar
                            </label>
                            {/* <select
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-grandkit-600 sm:text-sm sm:leading-6"
                                onChange={(event) =>
                                    addFilter("calendar_id", event.target.value)
                                }
                                value={filterCalendarId}
                            >
                                <option value="">All calendars</option>
                                {calendars.map((calendar) => (
                                    <option
                                        value={calendar.id}
                                        key={calendar.id}
                                    >
                                        {calendar?.color && (
                                            <div
                                                className={`ml-[1px] mr-2 rtl:ml-2 flex-shrink-0 h-4 w-4 rounded-full`}
                                                style={{
                                                    backgroundColor:
                                                        calendar.color,
                                                }}
                                            />
                                        )}
                                        {calendar.name}
                                    </option>
                                ))}
                            </select> */}
                            {/* <Transition
                                show={true}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            > */}
                            <Listbox value={filterCalendarId ?? ''} onChange={(event) => addFilter("calendar_id", event)}>
                                {({ open }) => (
                                    <>
                                        <div className="relative">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-grandkit-600 sm:text-sm sm:leading-6">
                                                <span className="flex items-center">
                                                    <span
                                                        aria-label={
                                                            filterCalendarId && calendars.find(item => item.id === filterCalendarId)?.color
                                                                ? "Online"
                                                                : "Offline"
                                                        }
                                                        className={classNames("inline-block h-2 w-2 flex-shrink-0 rounded-full bg-gray-200")}
                                                        style={{
                                                            backgroundColor: filterCalendarId && calendars.find(item => item.id === filterCalendarId)?.color
                                                        }}
                                                    />
                                                    <span className="ml-3 block truncate">
                                                        {filterCalendarId && calendars.find(item => item.id === filterCalendarId)?.name || "All calendars"}
                                                    </span>
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Listbox.Button>

                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                <Listbox.Option
                                                    value="" className={({
                                                        active,
                                                    }) =>
                                                        classNames(
                                                            active
                                                                ? "bg-grandkit-600 text-white"
                                                                : "text-gray-900",
                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                        )
                                                    }
                                                >
                                                    {({
                                                        filterCalendarId,
                                                        active,
                                                    }) => (
                                                        <>
                                                            <div className="flex items-center">
                                                            <span aria-label={filterCalendarId && calendars.find(item => item.id === filterCalendarId)?.color}
                                                                    className={"bg-gray-200 inline-block h-2 w-2 flex-shrink-0 rounded-full"} />
                                                                <span className={classNames(
                                                                    filterCalendarId === ""
                                                                        ? "font-semibold"
                                                                        : "font-normal",
                                                                    "ml-3 block truncate"
                                                                )}>
                                                                    All calendars
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                                    {calendars.map((calendar) => (
                                                        <Listbox.Option
                                                            key={calendar.id}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                classNames(
                                                                    active
                                                                        ? "bg-grandkit-600 text-white"
                                                                        : "text-gray-900",
                                                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                )
                                                            }
                                                            value={calendar.id}
                                                        >
                                                            {({
                                                                filterCalendarId,
                                                                active,
                                                            }) => (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <span
                                                                            className={"bg-gray-200 inline-block h-2 w-2 flex-shrink-0 rounded-full"}
                                                                            style={{
                                                                                backgroundColor: calendar.color,
                                                                            }}
                                                                            aria-hidden="true"
                                                                        />
                                                                        <span
                                                                            className={classNames(
                                                                                filterCalendarId
                                                                                    ? "font-semibold"
                                                                                    : "font-normal",
                                                                                "ml-3 block truncate"
                                                                            )}
                                                                        >
                                                                            {
                                                                                calendar.name
                                                                            }
                                                                            <span className="sr-only">
                                                                                {" "}
                                                                                is{" "}
                                                                                {calendar.color
                                                                                    ? "online"
                                                                                    : "offline"}
                                                                            </span>
                                                                        </span>
                                                                    </div>

                                                                    {filterCalendarId ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active
                                                                                    ? "text-white"
                                                                                    : "text-grandkit-600",
                                                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                            )}
                                                                        >
                                                                            <CheckIcon
                                                                                className="h-5 w-5"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        {/* </Transition> */}
                        </div>
                        { filterView !== "calendar" &&
                            <div className="w-full">
                            <label
                                htmlFor="location"
                                className="sr-only block text-sm font-medium leading-6 text-gray-900"
                            >
                                Date range
                            </label>
                            <Datepicker
                                value={dateRangeValue}
                                onChange={handleDateRangeChange}
                                showShortcuts={true}
                                primaryColor={"fuchsia"}
                                inputClassName="py-1.5 border-0 rounded-md text-gray-900 ring-1 ring-inset focus:ring-grandkit-600 shadow-sm ring-gray-300 focus:ring-2 focus:border-gray-300 h-[35px] rounded-md"
                            />
                        </div>}
                    </div>
                    <button
                        type="button"
                        onClick={clearFilter}
                        className="rounded-md bg-transparent px-2 py-1 text-sm text-grandkit-600 hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                    >
                        Reset
                    </button>
                </div>
            </Transition>
        </div>
    );
}
