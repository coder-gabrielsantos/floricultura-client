import API from "./base";

// Get the current user's shopping cart
export const getCart = async (token) => {
    const response = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Add items to cart
export const addToCart = async (productId, quantity, token) => {
    const response = await API.post(
        "/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};