import axios from "axios";
import API_ENDPOINTS from "../config/config";

// Login Function
export const loginUser = async (email: string, password: string, source: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH.LOGIN}`, {
      email,
      password,
      source,
    });

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
      ? error.response.data.message 
      : "Login failed";
    return { success: false, message: errorMessage };
  }
};

// Register Function
export const registerUser = async (name: string, email: string, phone: string, password: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.AUTH.REGISTER}`, {
      name,
      email,
      phone,
      password,
    });

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
    return { success: false, message: "Registration failed" };
  }
};
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.get(`${API_ENDPOINTS.AUTH.LOGOUT}`, {
      headers: { Authorization: `Token ${token}` },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};