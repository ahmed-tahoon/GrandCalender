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
import axios from "axios";
import { TrashIcon } from "@heroicons/react/20/solid";

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
            const response = await axios.delete(`/api/oauth2/google/disconnect/${provider.id}`);
            const { data } = response;
            console.log(data);
            if (data.status == 200) {
                toast.success(data.message);
                // redload page
                window.location.reload();
            }
        } catch (error) {
            const { data } = error.response.data;
            if (data.status == 400) {
                toast.error(data.message);
            }
        }
    };

    const checkIfUserIsConnected = () => {
        return user.providers.some((provider) => provider.provider === "google");
    };

    const provider =  user.providers.find((provider) => provider.provider === "google");

    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <div>
                {!checkIfUserIsConnected() && <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 uppercase flex">
                        <img src={GoogleCalendarSVG} className="h-6 w-6 mr-2" />
                        Connect to Google Calendar
                    </h2>
                    <div>
                        <a
                            href={`${apiEndpoint}/api/oauth2/google`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-grandkit-600 hover:bg-grandkit-700"
                        >
                            Connect
                        </a>
                    </div>
                </div>}
                {checkIfUserIsConnected() && <div>
                    <h2 className="text-base font-semibold text-gray-900 uppercase flex">
                        My Calendar Account
                    </h2>
                    <div className="flex items-center justify-between p-4 mt-2 rounded border-2">
                        {/* Account connect to google display email and name and avatar */}
                        <div className="flex items-center">
                            <img
                                src={GoogleCalendarSVG}
                                alt={provider.name}
                                className="h-6 w-6"
                            />
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {provider.email}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={disconnectToGoogleCalendar}
                                className="g-primary-btn-transparent"
                            >

                                <TrashIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>}
            </div>
        </AppLayout>
    );
}
