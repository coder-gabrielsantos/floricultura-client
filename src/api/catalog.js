import API from "./_baseURL.js";

// Get all catalogs
export const getCatalogs = async () => {
    const response = await API.get("/catalogs");
    return response.data;
};

// Create new catalog
export const createCatalog = async (data, token) => {
    const response = await API.post("/catalogs", data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update catalog by ID
export const updateCatalog = async (id, data, token) => {
    const response = await API.put(`/catalogs/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete catalog by ID
export const deleteCatalog = async (id, token) => {
    const response = await API.delete(`/catalogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
