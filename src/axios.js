import axios from 'axios';

const FIREBASE_URL = process.env.REACT_APP_FIREBASE_URL;

const axiosInstance = axios.create({
    baseURL: FIREBASE_URL,
});

export default axiosInstance;