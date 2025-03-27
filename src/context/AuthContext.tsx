import { createContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser, logoutUser} from "../services/authService";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthContextType {
  user: any;
  login: (email: string, password: string, source: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    // Get user from localStorage (Persisting user session)
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      // If token exists but no user, validate token (optional: call backend to verify)
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, source:string) => {
    try {
      const response = await loginUser(email, password, source);

      if (response.status === "Success") {
        setUser(response.result);
        localStorage.setItem("user", JSON.stringify(response.result));
        localStorage.setItem("token", response.token); // Token should be stored as string, no need for JSON.stringify()

        toast.success("Logged In");
      } else {
        console.log("Login error")
        toast.error("Invaild credentials")
      }
    } catch (error) {
      console.error(error)
    }
  };  

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await registerUser(name, email, phone, password);
      if (response.status === "Success" && response.data) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success(response.data.message || "Thank you for registering! You can Login now!");
      } else {
        console.log(response.message)
        toast.error(response.message)
      }
    } catch (error) {
      
      console.error("Registration error:", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser(); // Call API to destroy token
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged Out");
  };
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
