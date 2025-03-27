
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store token in localStorage
        const response = await axios.get(`${API_ENDPOINTS.AUTH.PROFILE}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const user = response.data.result;
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (err) {
        toast.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile input changes
  const handleProfileChange = (
    field: keyof typeof profileData,
    value: string
  ) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Update profile in backend
  const handleSaveProfile = async () => {
    try {
      setError(""); 
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_ENDPOINTS.AUTH.PROFILE}`,
        profileData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.message);
      toast.success(response.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);

      // Ensure err is an AxiosError before accessing its properties
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to update profile.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={profileData.name}
            onChange={(e) => handleProfileChange("name", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={profileData.email}
            onChange={(e) => handleProfileChange("email", e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={profileData.phone}
            onChange={(e) => handleProfileChange("phone", e.target.value)}
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleSaveProfile}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
