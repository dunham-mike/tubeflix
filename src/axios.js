import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://react-burger-builder-83547.firebaseio.com/'
});

export default axiosInstance;