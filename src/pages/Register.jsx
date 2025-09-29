import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Assuming a router context is available

// --- Utility Components and Initial State ---

// Initial structure for a single parent/guardian
const initialParent = {
  name: "",
  aadharNo: "",
  mobileNo: "",
  relation: "", // e.g., Father, Mother, Guardian
  photo: null, // Will hold File object or photo URL string
};

// Component to render a single input field
const InputField = ({ label, name, type = 'text', value, placeholder, required = false, onChange, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    />
  </div>
);

// Component to render Parent/Guardian input section
const ParentSection = ({ index, parent, loading, handleParentChange }) => (
  <div className="border border-indigo-300 p-4 rounded-xl bg-indigo-50/50 space-y-4">
    <h4 className="text-lg font-semibold text-indigo-700">Parent/Guardian {index + 1} ({parent.relation})</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField 
        label="Name" name="name" 
        value={parent.name || ''} 
        onChange={(e) => handleParentChange(index, e)} 
        required={parent.relation === "Father" || parent.relation === "Mother"}
        disabled={loading}
      />
      
      {/* Relation Field - Allow customization for Guardian, or keep fixed for Father/Mother */}
      <div>
        <label htmlFor={`relation-${index}`} className="block text-sm font-medium text-gray-700">
          Relation {parent.relation !== "Guardian" && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          name="relation"
          id={`relation-${index}`}
          value={parent.relation || ''}
          onChange={(e) => handleParentChange(index, e)}
          required={parent.relation !== "Guardian"}
          disabled={loading || parent.relation === "Father" || parent.relation === "Mother"}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
      </div>

      <InputField 
        label="Aadhar No." name="aadharNo" 
        value={parent.aadharNo || ''} 
        onChange={(e) => handleParentChange(index, e)} 
        placeholder="0000 0000 0000"
        disabled={loading}
      />
      <InputField 
        label="Mobile No." name="mobileNo" 
        value={parent.mobileNo || ''} 
        onChange={(e) => handleParentChange(index, e)} 
        placeholder="99999 99999"
        disabled={loading}
      />
    </div>
    <div>
      <label htmlFor={`parent-photo-${index}`} className="block text-sm font-medium text-gray-700">
        Upload Photo
      </label>
      <input
        type="file"
        // Name attribute is used here to identify the file input in the DOM, 
        // but the actual state update uses the 'photo' key inside handleParentChange.
        name={`parent_${index}_photo_file`} 
        id={`parent-photo-${index}`}
        accept="image/*"
        onChange={(e) => handleParentChange(index, e)}
        disabled={loading}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
      />
      {parent.photo && (
        <p className="text-xs text-gray-500 mt-1">
          {parent.photo instanceof File ? `New file selected: ${parent.photo.name}` : 'Existing photo available. Select a new file to replace it.'}
        </p>
      )}
    </div>
  </div>
);

// --- Main Component ---

export default function Register() {
  // Use a mock location state for demonstration since we are in a single file
  // In a real app, this would come from react-router-dom
  const location = useLocation();

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // const location = useLocation(); // Uncomment this in a full app with router
  
  const studentData = location.state?.studentData; // Data passed for editing

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    class: "6", // default class
    caste: "",
    mobileNo: "", 
    admissionYear: new Date().getFullYear().toString(),
    // REMOVED: serialNumber field is now handled by the backend
    address: "",
    village: "",
    block: "",
    district: "",
    state: "",
    studentPhoto: null,
    studentSignature: null,
    parents: [
      { ...initialParent, relation: "Father" },
      { ...initialParent, relation: "Mother" },
      { ...initialParent, relation: "Guardian" },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Load data if editing
  useEffect(() => {
    if (studentData) {
      setFormData(prev => ({
        ...prev,
        ...studentData,
        // Ensure parents array has Father/Mother/Guardian structure when editing
        parents: [
          ...studentData.parents.map(p => ({ ...initialParent, ...p })),
          // Add placeholders if not all 3 relations were provided
          ...Array(3 - studentData.parents.length).fill(initialParent).map((p, i) => ({ 
            ...p, 
            relation: ["Father", "Mother", "Guardian"][studentData.parents.length + i] 
          }))
        ].slice(0, 3) // Cap at 3 parents
      }));
    }
  }, [studentData]);

  // Handler for top-level text/select/file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  /**
   * IMPORTANT FIX: Handles nested parent inputs. 
   * It specifically checks for file inputs and assigns them to the 'photo' key, 
   * regardless of the file input's 'name' attribute.
   */
  const handleParentChange = (index, e) => {
    const { name, value, files, type } = e.target;
    const newParents = [...formData.parents];

    if (type === 'file') {
        // File inputs must map to the 'photo' state key
        newParents[index]['photo'] = files[0];
    } else {
        // Text/select inputs use their 'name' attribute
        newParents[index][name] = value;
    }
    setFormData(prev => ({ ...prev, parents: newParents }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(null);
  setError(null);

  const data = new FormData();
  const isEditing = !!studentData?._id;

  const structuredData = {
    ...formData,
    studentPhoto: formData.studentPhoto instanceof File ? undefined : formData.studentPhoto,
    studentSignature: formData.studentSignature instanceof File ? undefined : formData.studentSignature,
    parents: (formData.parents || []).map(p => ({
      ...p,
      photo: p.photo instanceof File ? undefined : p.photo
    }))
  };

  if (isEditing) {
    structuredData._id = studentData._id;
  }

  data.append("studentDataJson", JSON.stringify(structuredData));

  if (formData.studentPhoto instanceof File) {
    data.append("studentPhoto", formData.studentPhoto);
  }
  if (formData.studentSignature instanceof File) {
    data.append("studentSignature", formData.studentSignature);
  }

  (formData.parents || []).forEach((parent, index) => {
    if (parent.photo instanceof File) {
      data.append(`parent_${index}_photo`, parent.photo);
    }
  });

  try {
    const endpoint = isEditing
      ? `${BASE_URL}/students/${studentData._id}`
      : `${BASE_URL}/students`;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      body: data,
    });

    if (response.ok) {
      const result = await response.json();
      setSuccess(`Student ${isEditing ? "updated" : "registered"} successfully!`);
      // console.log("Saved student:", result.student);
    } else {
      const errorData = await response.json();
      setError(errorData.error || errorData.message || `Operation failed. Status: ${response.status}`);
    }
  } catch (err) {
    console.error("Submission Error:", err);
    setError("Network error. Could not connect to the server.");
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-[Inter]">
      <style>{`
        /* Load Inter font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Student {studentData ? "Edit" : "Enrollment"}</h2>
          <p className="text-center text-gray-500 mb-8">Please fill in all required fields accurately.</p>

          {(success || error) && (
            <div className={`p-3 mb-4 rounded-xl text-sm ${success ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`} role="alert">
              {success || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Details */}
            <div className="space-y-4 border-b pb-6 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3 rounded-tr-md">Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Student Name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required disabled={loading} />
                
                {/* Caste Dropdown */}
                <div>
                  <label htmlFor="caste" className="block text-sm font-medium text-gray-700">Caste</label>
                  <select id="caste" name="caste" value={formData.caste} onChange={handleChange} disabled={loading} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="" disabled>Select Caste</option>
                    <option value="GEN">GEN</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                {/* Removed Serial Number field */}
                <InputField label="Mobile Number" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="555 555 5555" disabled={loading} />
                <InputField label="Admission Year" name="admissionYear" type="number" value={formData.admissionYear} onChange={handleChange} required disabled={loading} placeholder="e.g., 2024" />

                {/* Admission Class */}
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700">Admission Class <span className="text-red-500">*</span></label>
                  <select name="class" id="class" value={formData.class} onChange={handleChange} required disabled={loading} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 6} value={i + 6}>Class {i + 6}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label htmlFor="studentPhoto" className="block text-sm font-medium text-gray-700">Upload Student Photo <span className="text-red-500">*</span></label>
                  <input type="file" name="studentPhoto" id="studentPhoto" accept="image/*" onChange={handleChange} required={!studentData} disabled={loading} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"/>
                  {(studentData?.studentPhoto || formData.studentPhoto) && (
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.studentPhoto instanceof File ? `New file selected: ${formData.studentPhoto.name}` : 'A photo is already uploaded. Select a new file to replace it.'}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="studentSignature" className="block text-sm font-medium text-gray-700">Upload Student Signature</label>
                  <input type="file" name="studentSignature" id="studentSignature" accept="image/*" onChange={handleChange} disabled={loading} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"/>
                  {(studentData?.studentSignature || formData.studentSignature) && (
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.studentSignature instanceof File ? `New file selected: ${formData.studentSignature.name}` : 'A signature is already uploaded. Select a new file to replace it.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4 border-b pb-6 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3 rounded-tr-md">Address Details</h3>
              <InputField label="Full Address" name="address" value={formData.address} onChange={handleChange} required disabled={loading} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField label="Village" name="village" value={formData.village} onChange={handleChange} disabled={loading} />
                <InputField label="Block" name="block" value={formData.block} onChange={handleChange} disabled={loading} />
                <InputField label="District" name="district" value={formData.district} onChange={handleChange} disabled={loading} />
                <InputField label="State" name="state" value={formData.state} onChange={handleChange} disabled={loading} />
              </div>
            </div>

            {/* Parent/Guardian Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3 rounded-tr-md">Parent/Guardian Details (Up to 3)</h3>
              <div className="space-y-6">
                {formData.parents.map((parent, index) => (
                  <ParentSection 
                    key={index} 
                    index={index} 
                    parent={parent} 
                    loading={loading} 
                    handleParentChange={handleParentChange} 
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300 transform hover:scale-[1.005]" disabled={loading}>
              {loading ? (
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {studentData ? 'Updating...' : 'Registering...'}
                  </div>
              ) : (
                studentData ? 'Update Registration' : 'Complete Registration'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
