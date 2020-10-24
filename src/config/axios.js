import axios from 'axios';
import 'dotenv';

export const axiosInstance = axios.create({
    baseURL: 'https://eze-backend-app.herokuapp.com'
});