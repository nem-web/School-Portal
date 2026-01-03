import React, { useState } from "react";

// --- Icons ---
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const LevelUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-500 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

// --- Reusable Modal Component ---
const ConfirmationModal = ({ 
    isModalOpen, modalAction, passwordInput, setPasswordInput, handleConfirmAction, setIsModalOpen, loading, modalError, deleteYear
}) => {
    const isPromote = modalAction === 'promote';
    const title = isPromote ? "Confirm Promotion" : "Confirm Deletion";
    const buttonColor = isPromote ? "bg-indigo-600 hover:bg-indigo-700" : "bg-rose-600 hover:bg-rose-700";
    
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setIsModalOpen(false)}></div>
        
        {/* Modal Card */}
        <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all duration-300 ${isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="text-center">
            {isPromote ? (
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                    <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                 </div>
            ) : (
                <AlertIcon />
            )}
            
            <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
            
            <div className="mt-2 px-2 py-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                {isPromote 
                  ? "This will advance ALL students to the next class level. e.g., Class 9 → Class 10." 
                  : `This will permanently delete records for students graduated in ${deleteYear}.`}
                <p className="mt-2 font-bold text-slate-800">This action cannot be undone.</p>
            </div>
          </div>

          <div className="mt-6">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Security Password</label>
             <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={loading}
                autoFocus
                placeholder="Enter Admin Password"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-center tracking-widest text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmAction()}
             />
             {modalError && <p className="text-rose-500 text-sm mt-2 text-center font-medium animate-pulse">{modalError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
              className="px-4 py-3 text-slate-600 bg-slate-100 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={loading}
              className={`px-4 py-3 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition transform active:scale-95 disabled:opacity-70 ${buttonColor}`}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
};

export default function OtherAdmin() {
  const ADMIN_PASSWORD = "admin123"; 
  
  const [deleteYear, setDeleteYear] = useState(new Date().getFullYear() - 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [modalError, setModalError] = useState(null);

  const currentYear = new Date().getFullYear();

  const handleConfirmAction = () => {
    if (passwordInput !== ADMIN_PASSWORD) {
      setModalError("Access Denied: Incorrect Password");
      return;
    }

    setModalError(null);
    setLoading(true);
    setMessage(null);

    // Close modal immediately to show loading state on main screen or keep it open with spinner
    // Let's keep modal open for processing visualization or close it:
    setIsModalOpen(false); 

    const BASE_URL = import.meta.env.VITE_SERVER_URL;

    if (modalAction === "promote") {
      fetch(`${BASE_URL}/students/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => { if (!res.ok) throw new Error("Promotion failed"); return res.json(); })
        .then((data) => {
          setMessage({ type: "success", text: "Success: All eligible students promoted!" });
        })
        .catch((error) => {
          setMessage({ type: "error", text: error.message });
        })
        .finally(() => setLoading(false));

    } else if (modalAction === "delete") {
      fetch(`${BASE_URL}/students/delete/${deleteYear}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => { if (!res.ok) throw new Error("Deletion failed"); return res.json(); })
        .then((data) => {
          setMessage({ type: "success", text: `Records for ${deleteYear} archived successfully.` });
        })
        .catch((error) => {
          setMessage({ type: "error", text: error.message });
        })
        .finally(() => setLoading(false));
    }
  };

  const openModal = (action) => {
    setModalAction(action);
    setModalError(null);
    setPasswordInput('');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <ConfirmationModal 
        isModalOpen={isModalOpen}
        modalAction={modalAction}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        handleConfirmAction={handleConfirmAction}
        setIsModalOpen={setIsModalOpen}
        loading={loading}
        modalError={modalError}
        deleteYear={deleteYear}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Tools</h1>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl">
            Advanced administrative actions. Please proceed with caution as some actions are irreversible.
          </p>
        </div>

        {/* Global Loading Overlay */}
        {loading && (
            <div className="fixed inset-0 z-40 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center space-x-4 border border-slate-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="text-lg font-bold text-slate-700">Processing Request...</span>
                </div>
            </div>
        )}
        
        {/* Message Toast */}
        {message && (
          <div className={`p-4 mb-8 rounded-xl shadow-sm flex items-center gap-3 animate-fade-in-down ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            <span className="text-2xl">{message.type === 'success' ? '🎉' : '⚠️'}</span>
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Promote */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100 border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <LevelUpIcon />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full">
                    Action Required
                </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-3">Batch Promotion</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Automatically advances <span className="font-bold text-slate-700">ALL students</span> to the next class level. Current Class 12 students will be marked as Graduated.
            </p>

            <button
              onClick={() => openModal('promote')}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98]"
            >
              Promote Students
            </button>
          </div>

          {/* Card 2: Cleanup */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl shadow-rose-100 border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>

            <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <ArchiveIcon />
                </div>
                <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Destructive
                </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-3">Data Cleanup</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Permanently delete records for students who graduated in a specific year.
            </p>

            <div className="space-y-4">
              <div className="relative">
                 <select
                    value={deleteYear}
                    onChange={(e) => setDeleteYear(e.target.value)}
                    disabled={loading}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none appearance-none cursor-pointer"
                 >
                    {[...Array(10)].map((_, i) => {
                      const year = currentYear - i - 1;
                      return <option key={year} value={year}>Batch of {year}</option>;
                    })}
                 </select>
                 <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </div>
              </div>

              <button
                onClick={() => openModal('delete')}
                disabled={loading}
                className="w-full py-4 bg-white border-2 border-rose-100 text-rose-600 rounded-xl font-bold text-lg hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-[0.98]"
              >
                Delete Records
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}