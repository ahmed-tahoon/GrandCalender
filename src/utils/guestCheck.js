import axios from 'axios';
import { redirect } from 'react-router-dom';
const loginToken = localStorage.getItem("login_token");

export default async function guestCheck() {
    if(loginToken) {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
        axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}
        // Get user detail
        const response = await axios.get('/api/me');

        if(response.data.data.id) {
            throw redirect("/dashboard");
        }

        return null;
    } else {
        return null;
    }
}