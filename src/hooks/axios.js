
import axios from 'axios';
const BASE_URL = 'https://app.getfit.us:8000';
//const BASE_URL = 'http://localhost:8000';

export default axios.create({
    baseURL: BASE_URL
});

export const  axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        withCredentials: true
    }
});