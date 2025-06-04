import axios from "axios";

// Axios instance with base API URL
const API = axios.create({
    baseURL: "https://floricultura-server.vercel.app/api",
});

export default API;
