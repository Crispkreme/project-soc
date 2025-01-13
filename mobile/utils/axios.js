import axiosLib from 'axios';

const axios = axiosLib.create({
    baseURL: 'http://10.0.120.55:8000/api',
    headers: {
        Accept: 'application/json',
    },
});

export default axios