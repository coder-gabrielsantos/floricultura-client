import API from "./base";

// Get all orders (admin only)
export const getAllOrders = async (token) => {
    const response = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Create an order
export const createOrder = async (orderData, token) => {
    const response = await API.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Get all available time blocks
export const getAvailableBlocks = async (date) => {
    const response = await API.get(`/orders/available-blocks?date=${date}`);
    return response.data.availableBlocks;
};
