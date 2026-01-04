import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import { generateStudentPDF } from "../utils/pdf";

// --- Icons ---
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>;

// Placeholder Background Images for Animation
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1000&auto=format&fit=crop",
];

export default function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${BASE_URL}/students/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch student details");
        const data = await res.json();
        setStudent(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handleEdit = () => navigate("/register", { state: { studentData: student } });

  // Filter parents
  const validParents = student?.parents?.filter(p => p.name && p.name.trim() !== "") || [];

  const openPDF = () => {
    window.open(`${BASE_URL}/students/${studentId}/pdf`, "_blank");
  };


  // --- Helpers ---
  const InfoRow = ({ label, value, fullWidth = false }) => (
    <div className={`p-3 bg-slate-50 rounded-lg border border-slate-100 ${fullWidth ? 'col-span-full' : ''}`}>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-800 font-medium break-words">{value || "—"}</p>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="max-w-5xl mx-auto p-4 animate-pulse space-y-6">
       <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="h-96 bg-slate-200 rounded-3xl"></div>
         <div className="h-96 bg-slate-200 rounded-3xl col-span-2"></div>
       </div>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-slate-50 pt-8"><LoadingSkeleton /></div>;

  if (error || !student) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
            <p className="text-xl text-red-500 font-bold mb-4">Student not found</p>
            <Link to="/students" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Back to List</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20 lg:pb-0">
      
      {/* --- Scrolling Background CSS --- */}
      <style>{`
        @keyframes scroll-bg {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .animate-scroll-bg {
          animation: scroll-bg 60s linear infinite;
          width: 200%;
          display: flex;
        }
      `}</style>

      {/* =================================================================================== */}
      {/* 1. VISIBLE SCREEN LAYOUT (Interactive, Animated) */}
      {/* =================================================================================== */}
      
      <main className="flex-grow relative z-0">
        
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 overflow-hidden bg-slate-900">
           <div className="absolute inset-0 flex items-center opacity-40">
              <div className="animate-scroll-bg">
                {[...BG_IMAGES, ...BG_IMAGES].map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0">
                    <img src={img} className="w-full h-full object-cover" alt="bg" />
                  </div>
                ))}
              </div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
           <div className="absolute top-6 left-6 z-10">
              <Link to={`/students/${student.class}`} className="flex items-center text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium border border-white/10">
                 <span>← Class {student.class}</span>
              </Link>
           </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10 pb-12">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: ID Card */}
              <div className="md:col-span-4 lg:col-span-3">
                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 sticky top-24">
                    <div className="h-24 bg-indigo-600 relative">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="p-1.5 bg-white rounded-full">
                                <img 
                                    src={student.studentPhoto || "https://via.placeholder.com/150"} 
                                    alt={student.name} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-50"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-6 px-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                        <p className="text-indigo-600 font-medium text-sm mt-1">Class {student.class}</p>
                        <div className="inline-block bg-slate-100 rounded-full px-3 py-1 text-xs font-bold text-slate-500 mt-2 tracking-wide uppercase">
                            Roll No: {student.serialNumber}
                        </div>

                        {/* Screen Buttons */}
                        <div className="mt-6 flex flex-col gap-2">
                            <button onClick={openPDF} className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]">
                                <PrintIcon /> Download Profile PDF
                            </button>
                            {user?.isAdmin && (
                                <button onClick={handleEdit} className="w-full flex items-center justify-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-100 py-2 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors">
                                    <EditIcon /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Details */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                 {/* Basic Info */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoRow label="Date of Birth" value={new Date(student.dob).toLocaleDateString()} />
                        <InfoRow label="Aadhar Number" value={student.aadharNo} />
                        <InfoRow label="Admission Year" value={student.admissionYear} />
                        <InfoRow label="Caste" value={student.caste} />
                    </div>
                 </div>

                 {/* Address */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                        Address Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label="Full Address" value={student.address} fullWidth />
                        <InfoRow label="Village" value={student.village} />
                        <InfoRow label="Block" value={student.block} />
                        <InfoRow label="District" value={student.district} />
                        <InfoRow label="State" value={student.state} />
                    </div>
                 </div>

                 {/* Parents */}
                 {validParents.length > 0 && (
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                            Guardian Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {validParents.map((p, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className="flex-shrink-0">
                                        {p.photo ? (
                                            <img src={p.photo} alt={p.name} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-slate-800 truncate">{p.name}</p>
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">{p.relation}</p>
                                        <div className="flex items-center text-xs text-slate-500 mt-2">
                                            <PhoneIcon /> <span className="ml-1">{p.mobileNo || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}
              </div>
           </div>
        </div>
      </main>

    </div>
  );
}
