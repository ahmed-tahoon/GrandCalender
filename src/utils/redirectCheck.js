import axios from 'axios';
import { redirect } from 'react-router-dom';
import userApi from './userApi';
const loginToken = localStorage.getItem("login_token");

export default async function redirectCheck() {
    if(loginToken) {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
        axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}
        
        // Get user detail
        const user = await axios.get('/api/me');

        return {user: user.data.data};
    } else {
        return null;
    }
}