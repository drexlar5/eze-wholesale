import axios from 'axios';
import 'dotenv';

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3001',
});