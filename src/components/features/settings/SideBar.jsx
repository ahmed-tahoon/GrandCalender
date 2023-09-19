import { ArrowTopRightOnSquareIcon, CheckCircleIcon, ClipboardDocumentIcon, GlobeAltIcon } from "@heroicons/react/20/solid";
import StandaloneTextField from "components/standalone-fields/StandaloneTextField";
import StandaloneToggleField from "components/standalone-fields/StandaloneToggleField";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from "react";
import { Link, useRevalidator } from "react-router-dom";
import bookingUrl from "utils/bookingUrl";
import moment from "moment-timezone";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function SideBar({user}) {
    const [isAvailable, setIsAvailable] = useState(user.is_available)
    let revalidator = useRevalidator();

    function onIsAvailableChange(value) {
        setIsAvailable(value)
        const formData = new FormData();
        formData.append("_method", 'put');
        formData.append("is_available", value);

        axios
            .post("/api/me", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'error') {
                    toast.error(response.data.message);
                }
                revalidator.revalidate();
            })
            .catch(function (error) {

            });
    }

    function onTurnOffMessageChange(value) {
        const formData = new FormData();
        formData.append("_method", 'put');
        formData.append("is_change_booking_page_off_message", 'yes');
        formData.append("booking_page_off_message", value);

        axios
            .post("/api/me", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'error') {
                    toast.error(response.data.message);
                }
                revalidator.revalidate();
            })
            .catch(function (error) {

            });
    }

    function copyToClipboard(value) {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard');
    }
    const endOfTheDayDateTime = ($data) => {
        const date = moment($data).endOf('day');
        // 2023-07-16 23:59 UTC
        return date.format('YYYY-MM-DD HH:mm [UTC]');
    }
    return (
        <div className="space-y-6">
            <StandaloneToggleField enabled={user.is_available} label="I am available" onChange={onIsAvailableChange} />

            {!isAvailable && <div>
                <StandaloneTextField value={user.booking_page_off_message} label="Turn off message" placeholder="Default is “I'm not available at the moment”" onChange={onTurnOffMessageChange} />
            </div>}

            {isAvailable && <div>
                <a href={bookingUrl(user.username)} target="_blank" rel="nofollow" className="flex items-center text-sm text-gray-500 space-s-1.5">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    {/* if subdomain has string then add . and add subdomain elase hidden dot  */}
                    <div><p>View my page</p><p className="text-xs">{import.meta.env.VITE_BOOKING_SUBDOMAIN !== '' ? import.meta.env.VITE_BOOKING_SUBDOMAIN + '.' : ''}{import.meta.env.VITE_APP_DOMAIN}/{user.username}</p></div>
                </a>
            </div>}

            {isAvailable && <div>
                <button onClick={() => copyToClipboard(bookingUrl(user.username))} className="flex items-center text-sm text-gray-500 space-s-1.5">
                    <ClipboardDocumentIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span>Copy my page link</span>
                </button>
            </div>}

            <div>
                <Link to="/dashboard/plans" className="flex items-center text-sm text-gray-500 space-s-1.5">
                    <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span>{user.current_plan.name}</span>
                </Link>
            </div>

            <div>
                <Link to="/dashboard/profile" className="flex items-center text-sm text-gray-500 space-s-1.5">
                    <GlobeAltIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span>{user.timezone}</span>
                </Link>
            </div>
            {!(user.current_plan.id != 1 && user?.current_subscription_cancelled_at) && <div className="rounded-md bg-yellow-50 p-4 mt-4">
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-yellow-700">
                        <p>
                            <b>{user?.current_subscription_next_plan ? user?.current_subscription_next_plan.name : 'Freemium'}</b> will be activated on {endOfTheDayDateTime(user?.current_subscription?.original_expires_at)}
                        </p>
                    </div>
                </div>
            </div>}
        </div>
    )
}
