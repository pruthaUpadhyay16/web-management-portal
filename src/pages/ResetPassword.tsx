import { useState } from "react";
import { Lock, Key,Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/config";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.FORGOT_PASSWORD_RESET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, password_confirm: confirmPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful. Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
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
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to your email and create a new password.
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

        <div className="relative mb-4">
          <Key className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 text-gray-500" />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 text-gray-500" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className="text-center mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
