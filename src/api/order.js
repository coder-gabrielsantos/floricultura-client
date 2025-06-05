import API from "./_baseURL.js";

// Get orders (admin or user)
export const getOrders = async (token) => {
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

// Start payment via Mercado Pago
export const startPayment = async ({ description, price, quantity }) => {
    const response = await API.post("/payments/create-preference", {
        description,
        price,
        quantity
    });
    return response.data.init_point;
};

// Update order status
export const updateOrderStatus = async (orderId, status, token) => {
    const response = await API.put(`/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
