import { useEffect, useState, Component } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import SideOver from "components/common/SideOver";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

// Props: events
export default function CalendarView({events, user, reloadItems}) {
    const [openEvent, setOpenEvent] = useState(false);
    const [event, setEvent] = useState({});

    return (
        <div className="calendar-view">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                // capitalize first letter of day
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                initialView="dayGridMonth"
                events={events}
                buttonText={{
                    today: "Today",
                    month: "Month",
                    week: "Week",
                    day: "Day",
                    list: "List",
                }}
                eventClick={async (info) => {
                    await setEvent(info.event);
                    console.log(info.event);
                    setOpenEvent(true);
                }}
                // grandkit-600
                dayMaxEvents={true}
            />
            <SideOver
                open={openEvent}
                close={() => setOpenEvent(false)}
                setOpen={setOpenEvent}
                item={event}
                user={user}
                reloadItems={reloadItems}
            />
        </div>
    );
}
