import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // Adjust if needed
});

// LOGIN
export const loginUser = async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
};

// REGISTER
export const registerUser = async (data) => {
    const response = await API.post("/auth/register", data);
    return response.data;
};

// CREATE PRODUCT
export const createProduct = async (productData) => {
    const response = await API.post("/products", productData);
    return response.data;
};

// GET CATALOGS
export const getCatalogs = async () => {
    const response = await API.get("/catalogs");
    return response.data;
};
