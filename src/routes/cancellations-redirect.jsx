import { useEffect, useState } from "react";
import axios from 'axios';
import bookingBaseUrl from "utils/bookingBaseUrl";
import { Link, useLoaderData, useParams } from "react-router-dom";
import moment from "moment";
import bookingUrl from "utils/bookingUrl";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function cancellations() {
    const data = useLoaderData();
    const { uid } = useParams();
    const [url, setUrl] = useState('')

    const user = data?.user ?? {}
    
    const getBooking = async () => {
        try {
            const response = await axios.get(`/api/bookings/${uid}/booking-uid`)
            if (response.data.status === 'success') {
                if (response.data.authrized) {
                    cancelUri(response.data.data, 'host')
                } else {
                    cancelUri(response.data.data, 'invitee')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const cancelUri = (item, type = 'host') => {
        let uri = `${bookingUrl(
            item?.user?.username, item?.calendar?.slug
        )}/cancellations/${item.uid}`
        if (type === 'host') {
            uri = `${location.origin}/dashboard/bookings?booking_id=${item.id}&trigger_cancel=${item.uid}`
        }
        setUrl(uri)
        window.location.href = uri
    }

    // Set page title
    useEffect(() => {
        document.title = 'Cancellation Redirect';
        getBooking()
    }, []);


    return (
        <div>
            Cancellation Redirect
        </div>
    )
}
