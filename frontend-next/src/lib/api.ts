import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://198.37.102.12',
    withCredentials: true,
    withXSRFToken: true,
});