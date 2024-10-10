import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
});


export default instance