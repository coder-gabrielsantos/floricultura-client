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

// Delete a product by ID
export const deleteProduct = async (id, token) => {
    const response = await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
