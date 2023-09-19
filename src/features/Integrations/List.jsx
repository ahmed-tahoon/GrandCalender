import { useEffect } from "react";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import TimezoneSelectField from "components/fields/TimezoneSelectField";
import AvailabilityField from "components/fields/AvailabilityField";
import TextField from "components/fields/TextField";
import { toast } from "react-toastify";
import GoogleCalendarSVG from "assets/integrations/google-calendar.svg";
import GoogleMeetSVG from "assets/integrations/google-meet.svg";
import ZoomSVG from "assets/integrations/zoom.svg";
import axios from "axios";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

export default function List() {
    const { user } = useLoaderData();
    let navigate = useNavigate();

    useEffect(() => {
        document.title = "Integrations";
    }, []);

    const checkHasZoom = user.providers.some((provider) => provider.provider === "zoom" && provider.meeting_type === "zoom");
    const checkHasGoogleMeet = user.providers.some((provider) => provider.provider === "google" && provider.meeting_type === "google_meet");
    const checkGoogleCalendar = user.providers.some((provider) => provider.provider === "google");

    // const provider =  user.providers.find((provider) => provider.provider === "google");

    return (
        <AppLayout user={user} sideBar={<SideBar />} sideBarStatus={false}
        layoutType="many_left_blocks">
            <div>
                <h2 className="text-base font-semibold text-gray-900 uppercase pb-4">
                    Integrations
                </h2>
                <div className="grid grid-cols-3 gap-x-4">
                    <Link to="/dashboard/integrations/google-calendar" className="bg-gray-50 px-4 py-4 sm:px-4 shadow hover:shadow-md cursor-pointer">
                        <div className="space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 mx-3 mb-2">
                                {/* google calendar svg */}
                                <img src={GoogleCalendarSVG} alt="Google Calendar" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                    <div className="hover:underline">Google Calendar</div>
                                    {checkGoogleCalendar ? <span className="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">connected</span>
                                        : <span className="mx-1 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-600">disconnected</span>}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <div>Add events to your calendar and prevent double booking</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to="/dashboard/integrations/google-meet" className="bg-gray-50 px-4 py-4 sm:px-4 shadow hover:shadow-md cursor-pointer">
                        <div className="space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 mx-3 mb-2">
                                {/* google calendar svg */}
                                <img src={GoogleMeetSVG} width={64} alt="Google Calendar" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                    <div className="hover:underline">Google Meet</div>
                                    {checkHasGoogleMeet ? <span className="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">connected</span>
                                        : <span className="mx-1 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-600">disconnected</span>}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <div>Include Google Meet details in your grandcalendar events</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to="/dashboard/integrations/zoom" className="bg-gray-50 px-4 py-4 sm:px-4 shadow hover:shadow-md cursor-pointer">
                        <div className="space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 mx-3 mb-2">
                                {/* google calendar svg */}
                                <img src={ZoomSVG} width={64} alt="Google Calendar" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                    <div className="hover:underline">Zoom Meeting</div>
                                    {checkHasZoom ? <span className="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">connected</span>
                                        : <span className="mx-1 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-600">disconnected</span>}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <div>Include Zoom Meeting details in your grandcalendar events</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
