import axios from "axios";

// Axios instance with base API URL
const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export default API;
