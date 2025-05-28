import API from "./base";

// Create a new address
export const createAddress = async (data, token) => {
    const response = await API.post("/addresses", data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Get an address by ID
export const getAddressById = async (id, token) => {
    const response = await API.get(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update an existing address
export const updateAddress = async (id, data, token) => {
    const response = await API.put(`/addresses/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete an address
export const deleteAddress = async (id, token) => {
    const response = await API.delete(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
