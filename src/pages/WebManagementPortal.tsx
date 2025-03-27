import Sidebar from "../component/Sidebar";
import EmergencyContacts from "../component/EmergencyContacts";
import Profile from "../component/Profile";
import Settings from "../component/Settings";
import { useState } from "react";
import Dashboard from "../component/Dashboard";

const WebManagementPortal = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "profile" && <Profile />}
        {activeSection === "emergency" && <EmergencyContacts />}
        {activeSection === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default WebManagementPortal;
