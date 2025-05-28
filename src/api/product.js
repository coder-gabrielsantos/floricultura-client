import API from "./base";

// Get all products
export const getAllProducts = async (token) => {
    const res = await API.get("/products", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Create a new product
export const createProduct = async (productData, token) => {
    const response = await API.post("/products", productData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Get product by ID
export const getProductById = async (id, token) => {
    const response = await API.get(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update product by ID
export const updateProduct = async (id, productData, token) => {
    const response = await API.put(`/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete a product by ID
export const deleteProduct = async (id, token) => {
    const response = await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
