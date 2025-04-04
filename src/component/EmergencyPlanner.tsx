import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmergencyPlanner = () => {
  const [medicalConditions, setMedicalConditions] = useState<
    { id: string | number; name: string }[]
  >([]);
  const [symptoms, setSymptoms] = useState<
    { id: string | number; name: string }[]
  >([]);

  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [severities, setSeverities] = useState<
    { id: string | number; name: string }[]
  >([]);
  const [contacts, setContacts] = useState<
    {
      is_primary: any;
      relationship: ReactNode;
      id: string | number;
      name: string;
      phone: string;
    }[]
  >([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<{
    condition: string | number;
    symptoms: {
      name: string | undefined;
      subquestion: string | undefined;
      option: string | undefined;
      severity: string | number;
    }[];
    severityLevels: {
      mild: { description: string; instructions: string; contacts: string[] };
      severe: { description: string; instructions: string; contacts: string[] };
      emergency: {
        description: string;
        instructions: string;
        contacts: string[];
      };
    };
    contacts: {
      is_primary: any;
      relationship: ReactNode;
      id: string | number;
      name: string;
      phone: string;
    }[];
  }>({
    condition: "",
    symptoms: [],
    severityLevels: {
      mild: { description: "", instructions: "", contacts: [] },
      severe: { description: "", instructions: "", contacts: [] },
      emergency: { description: "", instructions: "", contacts: [] },
    },
    contacts: [],
  });
  const [emergencyPlans, setEmergencyPlans] = useState<
    {
      symptoms: any;
      name: ReactNode;
      condition: ReactNode;
      id: string | number;
      description: string;
    }[]
  >([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("conditions");

  const [subquestions, setSubquestions] = useState<
    { id: string | number; question: string }[]
  >([]);
  const [subquestionOptions, setSubquestionOptions] = useState<
    {
      option_text: ReactNode;
      id: string | number;
      option: string;
    }[]
  >([]);
  const [selectedSubquestion, setSelectedSubquestion] = useState<string | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  const [selectedSymptoms] = useState<
    {
      symptom__name: string;
      sub_question__question: string;
      selected_option__option_text: string;
      severity__name: string;
    }[]
  >([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMedicalConditions();
    fetchEmergencyPlans();
    fetchSeverities();
    fetchContacts();
  }, []);

  const fetchSeverities = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.EMERGENCY_PLANNER.SEVERITY}`
      );
      setSeverities(response.data);
    } catch (error) {
      console.error("Error fetching severities:", error);
    }
  };

  const fetchMedicalConditions = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.EMERGENCY_PLANNER.MEDICAL_CONDITIONS
      );
      setMedicalConditions(response.data);
    } catch (error) {
      console.error("Error fetching medical conditions:", error);
    }
  };

  const fetchSymptoms = async (conditionId: string | number) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.EMERGENCY_PLANNER.SYMPTOMS}/${conditionId}`
      );
      setSymptoms(response.data);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  const fetchEmergencyPlans = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.EMERGENCY_PLANNER.GET_RECORD,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = response.data;

      // Optional: console log to verify structure
      console.log("API response", data);

      // Save QR code URL and medical condition data
      setQrCodeUrl(data.qr_code_url);

      const formattedPlans = data.medical_conditions.map((condition: any) => ({
        id: condition.id,
        name: condition.name,
        symptoms: condition.symptoms.map((symptom: any) => ({
          symptom_name: symptom.symptom__name,
          sub_question: symptom.sub_question__question,
          selected_option: symptom.selected_option__option_text,
          severity: symptom.severity__name,
        })),
      }));

      setEmergencyPlans(formattedPlans); // final structure into state
    } catch (error) {
      console.error("Error fetching emergency plans:", error);
    }
  };

  console.log(selectedSymptoms);
  const fetchSubquestions = async (symptomId: string | number) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.EMERGENCY_PLANNER.SUBQUESTIONS}${symptomId}`
      );
      setSubquestions(response.data);
    } catch (error) {
      console.error("Error fetching subquestions:", error);
    }
  };

  const fetchSubquestionOptions = async (subquestionId: string | number) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.EMERGENCY_PLANNER.SUBOPTIONS}${subquestionId}`
      );
      setSubquestionOptions(response.data);
    } catch (error) {
      console.error("Error fetching subquestion options:", error);
    }
  };
  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EMERGENCY_CONTACTS.LIST, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      setContacts(response.data.result);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const payload = {
    medical_condition: newPlan.condition, // Selected medical condition ID
    selected_symptoms: newPlan.symptoms.map((symptom) => ({
      name: symptom.name,
      subquestion: symptom.subquestion,
      option: symptom.option,
      severity: symptom.severity, // Severity level ID or name
    })),

    // added_contacts: newPlan.contacts, // Array of added emergency contacts
    added_contacts: newPlan.contacts.map((contact) => contact.id)

  };

  // const handleCreatePlan = async () => {
  //   try {
  //     const response = await axios.post(
  //       API_ENDPOINTS.EMERGENCY_PLANNER.USER_MEDICAL_RECORDS,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     setEmergencyPlans([...emergencyPlans, response.data]);
  //     setShowAddModal(false);
  //     setNewPlan({
  //       condition: "",
  //       symptoms: [],
  //       severityLevels: {
  //         mild: { description: "", instructions: "", contacts: [] },
  //         severe: { description: "", instructions: "", contacts: [] },
  //         emergency: { description: "", instructions: "", contacts: [] },
  //       },
  //       contacts: [],
  //     });
  //   } catch (error) {
  //     console.error("Error creating emergency plan:", error);
  //   }
  //   fetchEmergencyPlans();
  // };
  const handleCreatePlan = async () => {
    try {
      await axios.post(
        API_ENDPOINTS.EMERGENCY_PLANNER.USER_MEDICAL_RECORDS,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Don't push partial data
      fetchEmergencyPlans(); // fetch updated list
      setShowAddModal(false);
      setNewPlan({
        condition: "",
        symptoms: [],
        severityLevels: {
          mild: { description: "", instructions: "", contacts: [] },
          severe: { description: "", instructions: "", contacts: [] },
          emergency: { description: "", instructions: "", contacts: [] },
        },
        contacts: [],
      });
    } catch (error) {
      console.error("Error creating emergency plan:", error);
    }
  };
  

  const handleDeletePlan = async (conditionId: number) => {
    try {
      await axios.delete(
        `${API_ENDPOINTS.EMERGENCY_PLANNER.DELETE_RECORD}${conditionId}/delete/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // Remove the deleted condition from UI
      setEmergencyPlans((prev) =>
        prev.filter((condition) => condition.id !== conditionId)
      );
    } catch (error) {
      console.error("Error deleting emergency plan:", error);
    }
  };

  const handleNextTab = () => {
    if (currentTab === "conditions") setCurrentTab("symptoms");
    else if (currentTab === "symptoms") setCurrentTab("severityLevels");
    else if (currentTab === "severityLevels") setCurrentTab("contact");
  };

  const handlePreviousTab = () => {
    if (currentTab === "symptoms") setCurrentTab("conditions");
    else if (currentTab === "severityLevels") setCurrentTab("symptoms");
    else if (currentTab === "contact") setCurrentTab("severityLevels");
  };

  const isTabValid = () => {
    if (currentTab === "conditions") {
      return newPlan.condition !== "";
    } else if (currentTab === "symptoms") {
      return newPlan.symptoms.length > 0;
    } else if (currentTab === "severityLevels") {
      return newPlan.severityLevels !== null;
    } else if (currentTab === "contact") {
      return newPlan.contacts.length !== 0;
    }
    return true;
  };
  // Use useEffect to automatically add the symptom when all fields are selected
  useEffect(() => {
    if (
      selectedSymptom &&
      selectedSubquestion &&
      selectedOption &&
      selectedSeverity
    ) {
      // Find the selected option object
      const selectedOptionObj = subquestionOptions.find(
        (opt) => opt.id.toString() === selectedOption
      );

      // Use option_text if option doesn't exist
      const optionValue =
        selectedOptionObj?.option || selectedOptionObj?.option_text;

      const symptomToAdd = {
        name: symptoms.find(
          (symptom) => symptom.id.toString() === selectedSymptom
        )?.name,
        subquestion: subquestions.find(
          (sub) => sub.id.toString() === selectedSubquestion
        )?.question,
        option: optionValue, // Use the determined option value
        severity:
          severities.find((sev) => sev.id.toString() === selectedSeverity)
            ?.name || selectedSeverity,
      };

      // ✅ Check if symptom already exists
      const isDuplicate = newPlan.symptoms.some(
        (symptom) =>
          symptom.name === symptomToAdd.name &&
          symptom.subquestion === symptomToAdd.subquestion &&
          symptom.option === symptomToAdd.option
      );

      if (!isDuplicate) {
        console.log("Automatically adding symptom:", symptomToAdd);
        setNewPlan({
          ...newPlan,
          symptoms: [
            ...newPlan.symptoms,
            {
              ...symptomToAdd,
              option: String(symptomToAdd.option) || undefined,
            },
          ],
        });

        // Reset selections
        setSelectedSymptom(null);
        setSelectedSubquestion(null);
        setSelectedOption(null);
        setSelectedSeverity(null);
        setSubquestions([]);
        setSubquestionOptions([]);
      } else {
        toast.error(
          "Oops! This symptom with the same combination has already been added."
        );
      }
    }
  }, [selectedSymptom, selectedSubquestion, selectedOption, selectedSeverity]);

  const renderConditionsTab = () => {
    return (
      <div>
        <label className="block text-gray-700 mb-1">Medical Condition</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={newPlan.condition}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedCondition = medicalConditions.find(
              (cond) => cond.id === selectedId
            );

            setNewPlan({
              ...newPlan,
              condition: selectedCondition?.id || "",
              symptoms: [],
            });

            if (selectedCondition) fetchSymptoms(selectedCondition.id);
          }}
        >
          <option value="">Select a condition</option>
          {medicalConditions.map((condition) => (
            <option key={condition.id} value={condition.id}>
              {condition.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderSymptomsTab = () => {
    return (
      <div>
        <label className="block text-gray-700 mb-1">Symptoms</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={selectedSymptom || ""}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedSymptom = symptoms.find(
              (symptom) => symptom.id === selectedId
            );

            setSelectedSymptom(selectedSymptom?.id?.toString() || "");
            setSubquestions([]);
            setSubquestionOptions([]);
            setSelectedSubquestion(null);
            setSelectedOption(null);

            if (selectedSymptom) fetchSubquestions(selectedSymptom.id);
          }}
        >
          <option value="">Select a symptom</option>
          {symptoms.map((symptom) => (
            <option key={symptom.id} value={symptom.id}>
              {symptom.name}
            </option>
          ))}
        </select>
        {subquestions.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Subquestions</label>
            {subquestions.map((subquestion) => (
              <div key={subquestion.id} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="subquestion"
                    value={subquestion.id}
                    className="mr-2"
                    checked={selectedSubquestion === subquestion.id.toString()}
                    onChange={() => {
                      setSelectedSubquestion(subquestion.id.toString());
                      setSubquestionOptions([]);
                      setSelectedOption(null);
                      fetchSubquestionOptions(subquestion.id);
                    }}
                  />
                  {subquestion.question}
                </label>
              </div>
            ))}
          </div>
        )}
        {subquestionOptions.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Options</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={selectedOption || ""}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select an option</option>
              {subquestionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.option_text}
                </option>
              ))}
            </select>
          </div>
        )}
        {severities.length > 0 && selectedSymptom && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Severity Level</label>
            {severities.map((severity) => (
              <div key={severity.id} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="severity"
                    value={severity.id}
                    className="mr-2"
                    checked={selectedSeverity === severity.id.toString()}
                    onChange={() => {
                      // Just set the selected severity state, don't modify newPlan yet
                      setSelectedSeverity(severity.id.toString());
                    }}
                  />
                  {severity.name}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* {selectedSymptom &&
          selectedSubquestion &&
          selectedOption &&
          selectedSeverity && (
            <button
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => {
                // Find the selected option object
                const selectedOptionObj = subquestionOptions.find(
                  (opt) => opt.id.toString() === selectedOption
                );

                // Use option_text if option doesn't exist
                const optionValue =
                  selectedOptionObj?.option || selectedOptionObj?.option_text;

                const symptomToAdd = {
                  name: symptoms.find(
                    (symptom) => symptom.id.toString() === selectedSymptom
                  )?.name,
                  subquestion: subquestions.find(
                    (sub) => sub.id.toString() === selectedSubquestion
                  )?.question,
                  option: optionValue, // Use the determined option value
                  severity:
                    severities.find(
                      (sev) => sev.id.toString() === selectedSeverity
                    )?.name || selectedSeverity,
                };

                // Log the symptom to debug
                console.log("Adding symptom:", symptomToAdd);

                setNewPlan({
                  ...newPlan,
                  symptoms: [
                    ...newPlan.symptoms,
                    {
                      ...symptomToAdd,
                      option: String(symptomToAdd.option) || undefined,
                    },
                  ],
                });

                // Reset all selection states
                setSelectedSymptom(null);
                setSelectedSubquestion(null);
                setSelectedOption(null);
                setSelectedSeverity(null);
                setSubquestions([]);
                setSubquestionOptions([]);
              }}
            >
              + Add Symptom
            </button>
          )} */}
        {/* {newPlan.symptoms.length > 0 && (
          <button
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => {
              setSelectedSymptom(null);
              setSelectedSubquestion(null);
              setSelectedOption(null);
              setSelectedSeverity(null);
              setSubquestions([]);
              setSubquestionOptions([]);
            }}
          >
            + Add Another Symptom
          </button>
        )} */}

        {newPlan.symptoms.map((symptom, index) => (
          <div key={index} className="flex flex-col mb-4">
            <div className="flex items-center">
              <span className="flex-grow">
                {symptom.name}
                {symptom.subquestion ? ` - ${symptom.subquestion}` : ""}
                {symptom.option ? ` - ${symptom.option}` : ""}
                {symptom.severity ? ` - Severity: ${symptom.severity}` : ""}
              </span>
              <button
                className="text-red-600 hover:text-red-800 ml-4"
                onClick={() => {
                  const updatedSymptoms = newPlan.symptoms.filter(
                    (_, i) => i !== index
                  );
                  setNewPlan({ ...newPlan, symptoms: updatedSymptoms });
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const renderSeverityTab = () => {
    return (
      <div>
        <h3 className="text-lg font-bold mb-4">
          Selected Symptoms with Severity
        </h3>
        {newPlan.symptoms.map((symptom, index) => (
          <div key={index} className="mb-4">
            <p>
              <strong>Symptom:</strong> {symptom.name}
            </p>
            <p>
              <strong>Sub-Question:</strong> {symptom.subquestion}
            </p>
            <p>
              <strong>Answer:</strong> {symptom.option}
            </p>
            <p>
              <strong>Severity:</strong> {symptom.severity}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderContactsTab = () => {
    return (
      <div>
        <h3 className="text-lg font-bold mb-4">Emergency Contacts</h3>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => {
            const selectedContact = contacts.find(
              (contact) => contact.id.toString() === e.target.value
            );
            if (selectedContact) {
              setNewPlan({
                ...newPlan,
                contacts: [...newPlan.contacts, selectedContact],
              });
            }
          }}
        >
          <option value="">Select a contact</option>
          {Array.isArray(contacts) &&
            contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} - {contact.phone} ({contact.relationship})
                {contact.is_primary ? " [Primary]" : ""}
              </option>
            ))}
        </select>
        <div className="mt-4">
          <h4 className="font-bold">Selected Contacts:</h4>
          {newPlan.contacts.map((contact, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>
                {contact.name} - {contact.phone} ({contact.relationship})
                {contact.is_primary ? " [Primary]" : ""}
              </span>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => {
                  const updatedContacts = newPlan.contacts.filter(
                    (_, i) => i !== index
                  );
                  setNewPlan({ ...newPlan, contacts: updatedContacts });
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "conditions":
        return renderConditionsTab();
      case "symptoms":
        return renderSymptomsTab();
      case "severityLevels":
        return renderSeverityTab();
      case "contact":
        return renderContactsTab();
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center md:text-left mb-4 md:mb-0">
          Emergency Planner
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full md:w-auto"
          onClick={() => setShowAddModal(true)}
        >
          Create New Condition
        </button>
      </div>

      {qrCodeUrl && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Emergency QR Code
          </h3>
          <div className="flex justify-center">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="w-48 h-48 object-contain border border-gray-300 rounded-md"
        />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {emergencyPlans.map((condition) => (
          <div
        key={condition.id}
        className="bg-white shadow-lg rounded-lg p-6 flex flex-col border border-gray-200"
          >
        <h4 className="text-lg font-semibold mb-3 text-blue-700">
          {condition.name}
        </h4>
        <ul className="space-y-3">
          {condition.symptoms.map(
            (
          symptom: {
            symptom_name: string;
            sub_question: string;
            selected_option: string;
            severity: string;
          },
          index: number
            ) => (
          <li
            key={index}
            className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200"
          >
            <strong className="text-gray-800">{symptom.symptom_name}</strong>:{" "}
            {symptom.sub_question} -{" "}
            <em className="text-gray-600">{symptom.selected_option}</em>{" "}
            (<span className="text-red-600 font-medium">{symptom.severity}</span>)
          </li>
            )
          )}
        </ul>
        <button
          className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200"
          onClick={() => handleDeletePlan(Number(condition.id))}
        >
          Delete Plan
        </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Emergency Condition</h2>
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 ${
                    currentTab === "conditions"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setCurrentTab("conditions")}
                >
                  1. Condition
                </button>

                <button
                  className={`py-2 px-4 ${
                    currentTab === "symptoms"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setCurrentTab("symptoms")}
                >
                  2. Symptoms
                </button>
                <button
                  className={`py-2 px-4 ${
                    currentTab === "severityLevels"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setCurrentTab("severityLevels")}
                >
                  3. Severity levels
                </button>
                <button
                  className={`py-2 px-4 ${
                    currentTab === "contact"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setCurrentTab("contact")}
                >
                  4. Contact
                </button>
              </div>
            </div>
            {renderTabContent()}
            <div className="flex justify-between mt-6">
              <div>
                {currentTab !== "conditions" && (
                  <button
                    className="border border-gray-300 px-4 py-2 rounded"
                    onClick={handlePreviousTab}
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  className="border border-gray-300 px-4 py-2 rounded"
                  onClick={() => {
                    setShowAddModal(false);
                    setCurrentTab("conditions");
                    setMedicalConditions([]);
                    fetchMedicalConditions();
                    setSelectedSymptom(null);
                    setSelectedSubquestion(null);
                    setSelectedSeverity(null);
                    setSelectedOption(null);
                    setSubquestions([]);
                    setSubquestionOptions([]);
                  }}
                >
                  Cancel
                </button>
                {currentTab !== "contact" ? (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={handleNextTab}
                    disabled={!isTabValid()}
                  >
                    Next
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent page reload
                      handleCreatePlan();
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Create Condition
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyPlanner;
