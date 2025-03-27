import { useState } from "react";
import { Mail } from "lucide-react";
import API_ENDPOINTS from "../config/config";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.FORGOT_PASSWORD_REQUEST}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("A reset link has been sent to your email.");
        navigate("/reset-password")
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to receive a password reset link.
        </p>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleForgotPassword}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="text-center mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
