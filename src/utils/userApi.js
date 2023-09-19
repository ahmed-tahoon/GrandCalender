import axios from 'axios';
import { redirect } from 'react-router-dom';
const loginToken = localStorage.getItem("login_token");

export default async function userApi() {
    if(loginToken) {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
        axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}
        
        // Get user detail
        const user = await axios.get('/api/me');

        if(!user) {
            localStorage.removeItem("login_token");
            throw redirect("/login");
        }

        if(user.data.data.suspended_at) {
            throw redirect("/suspended");
        }

        if(user.data.data.deactivated_at) {
            throw redirect("/deactivated");
        }

        if(!user.data.data.email_verified_at) {
            throw redirect("/verify-email");
        }

        if(!user.data.data.username) {
            throw redirect("/onboarding");
        }
        
        return {user: user.data.data};
    } else {
        throw redirect("/login");
    }
}