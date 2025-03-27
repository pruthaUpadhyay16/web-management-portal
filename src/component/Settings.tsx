
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import API_ENDPOINTS from "../config/config";

const Settings: React.FC = () => {
  const auth = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [settings, setSettings] = useState({
    notifications: {
      emergencyAlerts: false,
      emailNotifications: false,
    },
    emergencyAppSettings: {
      locationServices: false,
      soundAlerts: false,
    },
  });
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.AUTH.PROFILE}`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      if (data.status === "Success") {
        setSettings({
          notifications: {
            emergencyAlerts: data.result.emergency_alerts,
            emailNotifications: data.result.email_notifications, 
          },
          emergencyAppSettings: {
            locationServices: data.result.location_services,
            soundAlerts: data.result.sound_alerts, 
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch user settings", error);
    }
  };

  // Fetch user settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handler for toggles
  const handleSettingChange = async (
    category: keyof typeof settings,
    setting: string
  ) => {
    try {
      let url = "";

      if (category === "notifications" && setting === "emergencyAlerts") {
        url = `${API_ENDPOINTS.AUTH.UPDATE_EMERGENCY_ALERTS}`; // API endpoint for emergency alerts
      } else if (
        category === "emergencyAppSettings" &&
        setting === "locationServices"
      ) {
        url = `${API_ENDPOINTS.AUTH.UPDATE_LOCATION_SERICES}`; // API endpoint for location services
      }

      if (url) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = response.data;

        if (response.data) {
          setSettings((prevSettings) => ({
            ...prevSettings,
            [category]: {
              ...prevSettings[category],
              [setting]: data[setting], 
            },
          }));
          fetchSettings();
        } else {
          console.error("Error updating setting:", data.message);
        }
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>

        <div className="flex justify-between items-center">
          <p className="font-medium">Emergency alerts</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.notifications.emergencyAlerts}
              onChange={() =>
                handleSettingChange("notifications", "emergencyAlerts")
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* <div className="flex justify-between items-center mt-3">
          <p className="font-medium">Email notifications</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.notifications.emailNotifications}
              onChange={() => handleSettingChange("notifications", "email_notifications", "update_email_notifications")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div> */}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Emergency App Settings</h2>

        <div className="flex justify-between items-center mb-3">
          <p className="font-medium">Location services</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.emergencyAppSettings.locationServices}
              onChange={() =>
                handleSettingChange("emergencyAppSettings", "locationServices")
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <button
          onClick={auth?.logout}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
