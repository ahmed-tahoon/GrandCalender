import { useEffect, useState } from "react";
import axios from 'axios';
import bookingUrl from "utils/bookingUrl";
import { Link, useLoaderData, useParams } from "react-router-dom";
import moment from "moment";
const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function reschedulings() {
    const data = useLoaderData();
    const { uid } = useParams();
    const [url, setUrl] = useState('')

    const user = data?.user ?? {}

    console.log(uid, user)
    
    const getBooking = async () => {
        try {
            const response = await axios.get(`/api/bookings/${uid}/booking-uid`)
            if (response.data.status === 'success') {
                if (response.data.authrized) {
                    hostReschedule(response.data.data, response.data.data.user, 'host')
                } else {
                    hostReschedule(response.data.data, response.data.data.user, 'invitee')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const hostReschedule = async (item, user, type = 'host') => {
        const payload = {
            type: 'host'
        }
        try {
            const response = await axios.post(`/api/bookings/${item.id}/reschedule`, payload);
            if (response.data.status === 'success') {
                const uri = `${bookingUrl(user.username, item.calendar.slug)}/${response.data.data.reschedule_uuid}/reschedule?type=${type}&date=${moment(item.date_time).format('YYYY-MM-DD')}&token=${response.data.token}`
                setUrl(uri)
                window.location.href = uri
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Set page title
    useEffect(() => {
        document.title = 'Reschedulings Redirect';
        getBooking()
    }, []);


    return (
        <div>
            Reschedulings Redirect <a href={url}
                className="mx-2 text-blue-500 hover:text-blue-700 underline cursor-pointer"
            >{url}</a>
        </div>
    )
}
