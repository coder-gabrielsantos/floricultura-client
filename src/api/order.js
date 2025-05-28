import API from "./base";

// Get all orders (admin only)
export const getAllOrders = async (token) => {
    const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
