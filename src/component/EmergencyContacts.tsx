import axios from "axios";
import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../config/config";

interface Contact {
  id: number;
  name: string;
  phone: string;
  is_primary:boolean,
  relationship: string;
}

const EmergencyContacts: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [showAddContactModal, setShowAddContactModal] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

 
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
    is_primary: false,
    relationship: "",
  });
  const token = localStorage.getItem("token");
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.EMERGENCY_CONTACTS.LIST}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEmergencyContacts(response.data.result); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching contacts:",
          error.response?.data || error.message
        );
      } else {
        console.error("Error fetching contacts:", error);
      }
    }
  };

  //  Fetch Contacts from Backend
  useEffect(() => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    fetchContacts();
  }, [token]); // Include token in dependency array

  // Add Contact (API)
  const handleAddContact = async () => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.EMERGENCY_CONTACTS.LIST}`,
        newContact,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) throw new Error("Failed to add contact");

      const addedContact = response.data;
      console.log(addedContact);
      setEmergencyContacts([...emergencyContacts, addedContact]);
      setNewContact({ name: "", phone: "", is_primary:false,relationship: "" });
      setShowAddContactModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  // ✅ Delete Contact (API)
  const handleDeleteContact = async (id: number) => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.EMERGENCY_CONTACTS.LIST}${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`, // Include the token in the request
          },
        }
      );

      if (!response) throw new Error("Failed to delete contact");

      setEmergencyContacts(
        emergencyContacts.filter((contact) => contact.id !== id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // ✅ Edit Contact (Open Edit Modal)
  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      is_primary: contact.is_primary,
      relationship: contact.relationship,
    });
    setShowAddContactModal(true);
  };

  // ✅ Update Contact (API)
  const handleUpdateContact = async () => {
    if (!currentContact) return;

    try {
      const response = await axios.put(
        `${API_ENDPOINTS.EMERGENCY_CONTACTS.LIST}${currentContact.id}/`,
        newContact,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response) throw new Error("Failed to update contact");

      const updatedContact = response.data;
      setEmergencyContacts(
        emergencyContacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        )
      );
      setNewContact({ name: "", phone: "", relationship: "", is_primary:false });
      setCurrentContact(null);
      setShowAddContactModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={() => {
            setCurrentContact(null);
            setNewContact({ name: "", phone: "", relationship: "", is_primary:false });
            setShowAddContactModal(true);
          }}
        >
          Add Contact
        </button>
      </div>

      {emergencyContacts.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600 mb-4">
            No emergency contacts added yet
          </p>
          <p className="text-gray-500">
            Add your first emergency contact to receive help during emergencies
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{contact.name}</h2>
                  <p className="text-gray-700">{contact.phone}</p>
                  <p className="text-sm text-gray-500">
                    {contact.relationship}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-600"
                    onClick={() => handleEditContact(contact)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-600"
                    onClick={() => {
                      setCurrentContact(contact);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="font-semibold text-gray-800 mb-2">Important</div>
        <p className="text-gray-700">
          Emergency contacts will be notified when you activate the emergency
          button in the 119 Emergency App. Make sure their contact information
          is correct.
        </p>
      </div>

      {/* Add/Edit Contact Modal */}
      {/* {showAddContactModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentContact
                ? "Edit Emergency Contact"
                : "Add Emergency Contact"}
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Relationship</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newContact.relationship}
                onChange={(e) =>
                  setNewContact({ ...newContact, relationship: e.target.value })
                }
              >
                <option value="">Select relationship</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="border border-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowAddContactModal(false);
                  setCurrentContact(null);
                  setNewContact({ name: "", phone: "", relationship: "" });
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={
                  currentContact ? handleUpdateContact : handleAddContact
                }
                disabled={
                  !newContact.name ||
                  !newContact.phone ||
                  !newContact.relationship
                }
              >
                {currentContact ? "Save Changes" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )} */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentContact
                ? "Edit Emergency Contact"
                : "Add Emergency Contact"}
            </h2>
 
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Relationship</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newContact.relationship}
                onChange={(e) =>
                  setNewContact({ ...newContact, relationship: e.target.value })
                }
              >
                <option value="">Select relationship</option>
                <option value="Secondary">Secondary</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Other">Other</option>
              </select>
            </div>

           
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                checked={newContact.is_primary}
                onChange={(e) =>
                  setNewContact({ ...newContact, is_primary: e.target.checked })
                }
              />
              <label className="ml-2 text-gray-700">
                Set as Primary Contact
              </label>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="border border-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowAddContactModal(false);
                  setCurrentContact(null);
                  setNewContact({
                    name: "",
                    phone: "",
                    relationship: "",
                    is_primary: false,
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={
                  currentContact ? handleUpdateContact : handleAddContact
                }
                disabled={
                  !newContact.name ||
                  !newContact.phone ||
                  !newContact.relationship
                }
              >
                {currentContact ? "Save Changes" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Contact Modal */}
      {showDeleteModal && currentContact && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Emergency Contact</h2>

            <p className="mb-6">
              Are you sure you want to delete {currentContact.name} from your
              emergency contacts?
            </p>

            <div className="flex justify-end space-x-2">
              <button
                className="border border-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentContact(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteContact(currentContact.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
