import axios from 'axios';
import { redirect } from 'react-router-dom';
const loginToken = localStorage.getItem("login_token");

export default async function userApiSuspended() {
    if(loginToken) {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
        axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}
        // Get user detail
        const user = await axios.get('/api/me');

        if(!user) {
            localStorage.removeItem("login_token");
            throw redirect("/login");
        }
        
        return {user: user.data.data};
    } else {
        throw redirect("/login");
    }
}