import { useEffect } from "react";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Field, Form } from "react-final-form";
import TimezoneSelectField from "components/fields/TimezoneSelectField";
import AvailabilityField from "components/fields/AvailabilityField";
import TextField from "components/fields/TextField";
import { toast } from "react-toastify";
import axios from "axios";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

export default function callback() {
    const { user } = useLoaderData();
    let navigate = useNavigate();

    // get id 
    const { id } = useParams();

    useEffect(() => {
        document.title = "Google Calendar callback";
        connectToGoogleCalendar();
        console.log(id);
    }, []);

    /**
     * Connect User to Google Calendar api
    */
    const connectToGoogleCalendar = async () => {
        try {
            const response = await axios.post(`/api/oauth2/google/connect/${id}`);
            const { data } = response;
            if (data.status == 200) {
                toast.success(data.message);
                navigate("/dashboard/integrations/google-calendar");
            }

        } catch (error) {
            if (error.response.data.status == 400) {
                toast.error(error.response.data.message);
                navigate("/dashboard/integrations/google-calendar");
            }
        }
    };

    return (
        // Redirect to the google calendar page "Redirecting..., please wait a moment while we redirect you to the Google Calendar page to connect your account, if you are not redirected, please click here to go to the Google Calendar page."
        <div className="p-2">
            <h1>Redirecting..., please wait a moment.</h1>
        </div>
    );
}
