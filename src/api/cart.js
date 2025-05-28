import API from "./base";

// Get the current user's shopping cart
export const getCart = async (token) => {
    const response = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
