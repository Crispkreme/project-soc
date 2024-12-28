import axiosLib from 'axios';

const axios = axiosLib.create({
    baseURL: 'http://192.168.1.22:8000/api',
    headers: {
        Accept: 'application/json',
    },
});

export default axios