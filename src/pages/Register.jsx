import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 

// --- Icons ---
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3h-3.172a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;

// --- Initial State ---
const initialParent = {
  name: "",
  aadharNo: "",
  mobileNo: "",
  relation: "", 
  photo: null, 
};

// --- Reusable Input Component ---
const InputField = ({ label, name, type = 'text', value, placeholder, required = false, onChange, disabled, icon }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative rounded-md shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${icon ? 'pl-10' : 'pl-3'} block w-full py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out`}
      />
    </div>
  </div>
);

// --- Camera Component ---
const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Unable to access camera. Please check permissions.");
        onClose();
      }
    }
    setupCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
        onCapture(file);
        onClose();
      }, 'image/jpeg');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md flex flex-col">
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold">Take Photo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="relative bg-black aspect-[4/3]">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <div className="p-6 bg-slate-50 flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100">Cancel</button>
          <button onClick={takePhoto} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center gap-2">
            <CameraIcon /> Snap
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Parent Section ---
const ParentSection = ({ index, parent, loading, handleParentChange }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
      <h4 className="text-lg font-bold text-indigo-700">Guardian {index + 1}</h4>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
        {parent.relation}
      </span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <InputField 
        label="Name" name="name" 
        value={parent.name || ''} 
        onChange={(e) => handleParentChange(index, e)} 
        required={parent.relation === "Father" || parent.relation === "Mother"}
        disabled={loading}
        icon={<UserIcon />}
      />
      
      <div>
        <label htmlFor={`relation-${index}`} className="block text-sm font-semibold text-slate-700 mb-1">
          Relation {parent.relation !== "Guardian" && <span className="text-red-500">*</span>}
        </label>
        <select
          name="relation"
          id={`relation-${index}`}
          value={parent.relation || ''}
          onChange={(e) => handleParentChange(index, e)}
          required={parent.relation !== "Guardian"}
          disabled={loading || parent.relation === "Father" || parent.relation === "Mother"}
          className="block w-full py-2.5 px-3 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Father">Father</option>
          <option value="Mother">Mother</option>
          <option value="Guardian">Guardian</option>
          <option value="Uncle">Uncle</option>
          <option value="Aunt">Aunt</option>
        </select>
      </div>

      <InputField label="Aadhar No." name="aadharNo" value={parent.aadharNo || ''} onChange={(e) => handleParentChange(index, e)} placeholder="0000 0000 0000" disabled={loading} />
      <InputField label="Mobile No." name="mobileNo" value={parent.mobileNo || ''} onChange={(e) => handleParentChange(index, e)} placeholder="99999 99999" disabled={loading} />
    </div>

    {/* Parent Photo Upload (Simplified for brevity, camera can be added here too if needed) */}
    <div className="pt-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Photo</label>
      <input
        type="file"
        name={`parent_${index}_photo_file`} 
        accept="image/*"
        onChange={(e) => handleParentChange(index, e)}
        disabled={loading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
      />
    </div>
  </div>
);

// --- Main Register Component ---
export default function Register() {
  const location = useLocation();
  const navigate = useNavigate(); // Added for navigation after submit
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const studentData = location.state?.studentData; 

  const [formData, setFormData] = useState({
    name: "", dob: "", class: "6", caste: "", mobileNo: "", admissionYear: new Date().getFullYear().toString(),
    address: "", village: "", block: "", district: "", state: "",
    studentPhoto: null,
    parents: [
      { ...initialParent, relation: "Father" },
      { ...initialParent, relation: "Mother" },
      { ...initialParent, relation: "Guardian" },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (studentData) {
      setFormData(prev => ({
        ...prev, ...studentData,
        parents: [
          ...studentData.parents.map(p => ({ ...initialParent, ...p })),
          ...Array(3 - studentData.parents.length).fill(initialParent).map((p, i) => ({ 
            ...p, relation: ["Father", "Mother", "Guardian"][studentData.parents.length + i] 
          }))
        ].slice(0, 3)
      }));
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleParentChange = (index, e) => {
    const { name, value, files, type } = e.target;
    const newParents = [...formData.parents];
    if (type === 'file') newParents[index]['photo'] = files[0];
    else newParents[index][name] = value;
    setFormData(prev => ({ ...prev, parents: newParents }));
  };

  // Callback when camera captures an image
  const handleCameraCapture = (file) => {
    setFormData(prev => ({ ...prev, studentPhoto: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess(null); setError(null);

    const data = new FormData();
    const isEditing = !!studentData?._id;
    const structuredData = {
      ...formData,
      studentPhoto: formData.studentPhoto instanceof File ? undefined : formData.studentPhoto,  
      parents: (formData.parents || []).map(p => ({ ...p, photo: p.photo instanceof File ? undefined : p.photo }))
    };

    if (isEditing) structuredData._id = studentData._id;
    data.append("studentDataJson", JSON.stringify(structuredData));

    if (formData.studentPhoto instanceof File) data.append("studentPhoto", formData.studentPhoto);
    (formData.parents || []).forEach((parent, index) => {
      if (parent.photo instanceof File) data.append(`parent_${index}_photo`, parent.photo);
    });

    try {
      const endpoint = isEditing ? `${BASE_URL}/students/${studentData._id}` : `${BASE_URL}/students`;
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(endpoint, { method, body: data });

      if (response.ok) {
        setSuccess(`Student ${isEditing ? "updated" : "registered"} successfully!`);
        setTimeout(() => navigate("/students"), 2000); // Redirect after success
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || `Operation failed.`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20">
       <script src="https://cdn.tailwindcss.com"></script>
       
       {/* Camera Modal */}
       {showCamera && (
         <CameraCapture 
           onClose={() => setShowCamera(false)} 
           onCapture={handleCameraCapture} 
         />
       )}

      <main className="flex-grow p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                {studentData ? "Edit Resident Profile" : "New Resident Enrollment"}
              </h2>
              <p className="text-slate-400">Complete the form below to register a student in the hostel system.</p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {(success || error) && (
              <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {success ? "✅" : "⚠️"} {success || error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* --- Section 1: Personal Info --- */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg font-bold">01</div>
                  <h3 className="text-xl font-bold text-slate-800">Student Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} icon={<UserIcon />} />
                  <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required disabled={loading} />
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Caste</label>
                    <select name="caste" value={formData.caste} onChange={handleChange} disabled={loading} className="block w-full py-2.5 px-3 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500">
                      <option value="" disabled>Select Caste</option>
                      <option value="GEN">GEN</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>

                  <InputField label="Contact Number" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="555 555 5555" disabled={loading} />
                  <InputField label="Admission Year" name="admissionYear" type="number" value={formData.admissionYear} onChange={handleChange} required disabled={loading} />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Class <span className="text-red-500">*</span></label>
                    <select name="class" value={formData.class} onChange={handleChange} required disabled={loading} className="block w-full py-2.5 px-3 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500">
                      {[...Array(7)].map((_, i) => <option key={i + 6} value={i + 6}>Class {i + 6}</option>)}
                    </select>
                  </div>
                </div>

                {/* --- Photo Upload with Camera --- */}
                <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Student Photo <span className="text-red-500">*</span></label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* File Input */}
                    <div className="flex-grow w-full sm:w-auto">
                        <label className="cursor-pointer flex items-center justify-center w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition">
                            <UploadIcon />
                            <span className="ml-2 text-sm font-medium text-slate-600">Upload from Device</span>
                            <input type="file" name="studentPhoto" accept="image/*" onChange={handleChange} disabled={loading} className="hidden" />
                        </label>
                    </div>

                    <span className="text-slate-400 text-sm font-medium">OR</span>

                    {/* Camera Button */}
                    <button 
                      type="button"
                      onClick={() => setShowCamera(true)}
                      disabled={loading}
                      className="w-full sm:w-auto flex items-center justify-center px-4 py-3 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-200 transition"
                    >
                      <CameraIcon />
                      <span className="ml-2">Use Camera</span>
                    </button>
                  </div>

                  {/* Preview / Status */}
                  {(studentData?.studentPhoto || formData.studentPhoto) && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 w-fit">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {formData.studentPhoto instanceof File ? (
                            <img src={URL.createObjectURL(formData.studentPhoto)} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                           <span className="text-xs">Old</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 font-medium">
                        {formData.studentPhoto instanceof File ? "Photo ready for upload" : "Existing photo on file"}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* --- Section 2: Address --- */}
              <section className="border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg font-bold">02</div>
                  <h3 className="text-xl font-bold text-slate-800">Address Details</h3>
                </div>
                <div className="space-y-4">
                  <InputField label="Full Address" name="address" value={formData.address} onChange={handleChange} required disabled={loading} placeholder="Street, landmark, etc." />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputField label="Village" name="village" value={formData.village} onChange={handleChange} disabled={loading} />
                    <InputField label="Block" name="block" value={formData.block} onChange={handleChange} disabled={loading} />
                    <InputField label="District" name="district" value={formData.district} onChange={handleChange} disabled={loading} />
                    <InputField label="State" name="state" value={formData.state} onChange={handleChange} disabled={loading} />
                  </div>
                </div>
              </section>

              {/* --- Section 3: Guardians --- */}
              <section className="border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg font-bold">03</div>
                  <h3 className="text-xl font-bold text-slate-800">Guardian Details</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {formData.parents.map((parent, index) => (
                    <ParentSection key={index} index={index} parent={parent} loading={loading} handleParentChange={handleParentChange} />
                  ))}
                </div>
              </section>

              {/* Submit Button */}
              <div className="pt-6">
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-indigo-700 hover:shadow-xl active:scale-[0.99] disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none transition-all duration-200" disabled={loading}>
                  {loading ? 'Processing...' : (studentData ? 'Update Profile' : 'Complete Enrollment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}