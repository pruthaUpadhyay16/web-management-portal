import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import Layout from "./ui/layout";
import WebManagementPortal from "./pages/WebManagementPortal";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);
  console.log(auth);
  return auth?.user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {
                  <Layout>
                    <WebManagementPortal />
                  </Layout>
                }
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
