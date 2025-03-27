// import React, { useState } from "react";

// interface Contact {
//   id: number;
//   name: string;
//   phone: string;
//   relationship: string;
// }

// const Dashboard = () => {
//   const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([
//     {
//       id: 1,
//       name: "John Doe",
//       phone: "+1 234 567 8901",
//       relationship: "Primary",
//     },
//     {
//       id: 2,
//       name: "Sarah Smith",
//       phone: "+1 234 567 8902",
//       relationship: "Secondary",
//     },
//   ]);
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-blue-50 p-6 rounded-lg">
//           <h2 className="text-xl font-semibold mb-2">Emergency Contacts</h2>
//           <div className="text-3xl font-bold mb-2">
//             {emergencyContacts.length}
//           </div>
//           <p className="text-gray-600">Contacts configured</p>
//         </div>

//         <div className="bg-green-50 p-6 rounded-lg">
//           <h2 className="text-xl font-semibold mb-2">Emergency App</h2>
//           <div className="text-xl font-bold text-green-700 mb-1">Active</div>
//           <p className="text-gray-600">Ready for emergencies</p>
//         </div>
//       </div>

//       <div className="bg-white border border-gray-200 rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

//         <div className="space-y-4">
//           <div className="border-b border-gray-100 pb-4">
//             <h3 className="font-medium">Emergency app installed</h3>
//             <p className="text-gray-500">2 days ago</p>
//           </div>

//           <div className="border-b border-gray-100 pb-4">
//             <h3 className="font-medium">Emergency contact added</h3>
//             <p className="text-gray-500">3 days ago</p>
//           </div>

//           <div className="pb-2">
//             <h3 className="font-medium">Account created</h3>
//             <p className="text-gray-500">5 days ago</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/config";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  app_installed: boolean;
  account_created_at: string;
  emergency_contact_added_at: string;
  app_installed_at: string;
}

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const headers = { Authorization: `Token ${token}` };

        // Fetch Profile
        const profileResponse = await axios.get(
          `${API_ENDPOINTS.AUTH.PROFILE}`,
          { headers }
        );
        setUserProfile(profileResponse.data.result);
        console.log(profileResponse.data.result);
        // Fetch Emergency Contacts
        // const contactsResponse = await axios.get(API_ENDPOINTS.EMERGENCY_CONTACTS, { headers });
        setEmergencyContacts(
          profileResponse.data.result.emergency_contacts_count
        );
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Emergency Contacts Card */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Emergency Contacts</h2>
          <div className="text-3xl font-bold mb-2">{emergencyContacts}</div>
          <p className="text-gray-600">Contacts configured</p>
        </div>

        {/* User Status Card */}
        <div
          className={`p-6 rounded-lg ${
            userProfile?.app_installed ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">Account Status</h2>
          <div
            className={`text-xl font-bold mb-1 ${
              userProfile?.app_installed ? "text-green-700" : "text-red-700"
            }`}
          >
            {userProfile?.app_installed ? "Active" : "Inactive"}
          </div>
          <p className="text-gray-600">
            {userProfile?.app_installed
              ? "Your account is active"
              : "Please contact admin"}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-medium">Emergency app installed</h3>
            <p className="text-gray-500">{userProfile?.app_installed_at}</p>
          </div>
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-medium">Emergency contact added</h3>
            <p className="text-gray-500">
              {userProfile?.emergency_contact_added_at}
            </p>
          </div>
          <div className="pb-2">
            <h3 className="font-medium">Account created</h3>
            <p className="text-gray-500">{userProfile?.account_created_at}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
