import { useEffect } from "react";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import TimezoneSelectField from "components/fields/TimezoneSelectField";
import AvailabilityField from "components/fields/AvailabilityField";
import TextField from "components/fields/TextField";
import { toast } from "react-toastify";
import GoogleMeetSVG from "assets/integrations/google-meet.svg";
import GoogleCalendarSVG from "assets/integrations/google-calendar.svg";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/20/solid";
import { LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

export default function index() {
    const { user } = useLoaderData();
    let navigate = useNavigate();

    useEffect(() => {
        document.title = "Google Calendar";
    }, []);

    /**
     * Disconnect to Google Calendar api
     */
    const disconnectToGoogleCalendar = async () => {
        try {
            const response = await axios.delete(`/api/oauth2/google/disconnect/${provider.id}?google_meet=true`);
            const { data } = response;
            console.log(data);
            if (data.status == 200) {
                // redload page
                window.location.reload();
                toast.success(data.message);
            }
        } catch (error) {
            const { data } = error.response.data;
            if (data.status == 400) {
                toast.error(data.message);
            }
        }
    };

    /**
     * Connect User to Google Calendar api
    */
    const connectToGoogleMeet = async () => {
        try {
            const response = await axios.post(`/api/oauth2/google/connect/${provider.provider_id}?google_meet=true`);
            const { data } = response;
            if (data.status == 200) {
                window.location.reload();
                toast.success(data.message);
            }

        } catch (error) {
            if (error.response.data.status == 400) {
                toast.error(error.response.data.message);
            }
        }
    };

    const checkIfUserIsConnected = () => {
        return user.providers.some((provider) => provider.provider === "google");
    };

    const checkHasGoogleMeet = user.providers.some((provider) => provider.provider === "google" && provider.meeting_type === "google_meet");

    const provider =  user.providers.find((provider) => provider.provider === "google");

    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <div>
                {!checkIfUserIsConnected() && <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 uppercase flex">
                            <img src={GoogleCalendarSVG} className="h-6 w-6 mr-2" />
                            Connect to Google Calendar
                        </h2>
                        <small>Connect google calendar with google meet</small>
                    </div>
                    <div>
                        <a
                            href={`${apiEndpoint}/api/oauth2/google`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-grandkit-600 hover:bg-grandkit-700"
                        >
                            Connect Google Calendar
                        </a>
                    </div>
                </div>}
                {checkIfUserIsConnected() && <div>
                    <h2 className="text-base font-semibold text-gray-900 uppercase flex">
                        MY Google Meet
                    </h2>
                    <small className="text-gray-500">Allow google meet in your calendars</small>
                    <div className="flex items-center justify-between p-4 mt-2 rounded border-2">
                        {/* Account connect to google display email and name and avatar */}
                        <div className="flex items-center">
                            <img
                                src={GoogleMeetSVG}
                                alt={provider.name}
                                className="h-6 w-6"
                            />
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {provider.email} {checkHasGoogleMeet ? <span class="mx-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-600">connected</span>
                                        : <span className="mx-1 inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-600">disconnected</span>
                                }
                                </div>
                            </div>
                        </div>
                        <div>
                            {checkHasGoogleMeet && <button
                                type="button"
                                onClick={disconnectToGoogleCalendar}
                                className="g-primary-btn-transparent"
                            >

                                <XMarkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                            </button>}
                            {!checkHasGoogleMeet && <button
                                type="button"
                                onClick={connectToGoogleMeet}
                                className="g-primary-btn-transparent"
                            >

                                <LinkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                            </button>}
                        </div>
                    </div>
                </div>}
            </div>
        </AppLayout>
    );
}
