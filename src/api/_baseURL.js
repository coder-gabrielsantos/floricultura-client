import axios from "axios";

// Axios instance with base API URL
const API = axios.create({
    baseURL: "http://192.168.1.5:5000/api",
});

export default API;
