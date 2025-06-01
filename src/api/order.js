import API from "./base";

// Get all orders (admin only)
export const getAllOrders = async (token) => {
    const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Get all available time blocks
export const getAvailableBlocks = async (date) => {
    const res = await API.get(`/orders/available-blocks?date=${date}`);
    return res.data.availableBlocks;
};
