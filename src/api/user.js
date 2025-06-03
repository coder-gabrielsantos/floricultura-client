import API from "./_baseURL.js";

// Log in a user
export const loginUser = async (credentials) => {
    const response = await API.post("/users/login", credentials);
    return response.data;
};

// Register a new user
export const registerUser = async (data) => {
    const response = await API.post("/users/register", data);
    return response.data;
};

// Get the currently logged-in user's data
export const getUserData = async () => {
    const response = await API.get("/users/me", {
        headers: {
            Authorization: `Bearer ${
                localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).token
                    : ""
            }`
        }
    });
    return response.data;
};

// Update user profile
export const updateProfile = async (data) => {
    const response = await API.put("/users/me", data, {
        headers: {
            Authorization: `Bearer ${
                localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).token
                    : ""
            }`
        }
    });
    return response.data;
};
