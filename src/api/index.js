import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // Adjust if needed
});

// LOGIN
export const loginUser = async (credentials) => {
    const response = await API.post("/users/login", credentials);
    return response.data;
};

// REGISTER
export const registerUser = async (data) => {
    const response = await API.post("/users/register", data);
    return response.data;
};

// GET USER DATA
export const getUserData = async () => {
    const response = await API.get("/users/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : ""}`
        }
    });
    return response.data;
};

// CREATE ADDRESS
export const createAddress = async (data, token) => {
    const response = await API.post("/addresses", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// GET ADDRESS BY ID
export const getAddressById = async (id, token) => {
    const response = await API.get(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// UPDATE ADDRESS
export const updateAddress = async (id, data, token) => {
    const response = await API.put(`/addresses/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// DELETE ADDRESS
export const deleteAddress = async (id, token) => {
    const response = await API.delete(`/addresses/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// GET CART
export const getCart = async (token) => {
    const response = await API.get("/cart", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
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
