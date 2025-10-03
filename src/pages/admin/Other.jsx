import React, { useState } from "react";

// --- Reusable Modal Component (Defined OUTSIDE to prevent re-rendering/focus loss) ---
const ConfirmationModal = ({ 
    isModalOpen, 
    modalAction, 
    passwordInput, 
    setPasswordInput, 
    handleConfirmAction, 
    setIsModalOpen, 
    loading, 
    modalError,
    deleteYear
}) => {
    const isPromote = modalAction === 'promote';
    const title = isPromote ? "Confirm Student Promotion" : "Confirm Database Deletion";
    const warning = isPromote 
      ? "WARNING: This action will permanently modify the class level for ALL students. This process cannot be easily reversed."
      : `CRITICAL WARNING: This action will permanently delete/archive records for graduates admitted in ${deleteYear}. This data will be LOST.`;

    return (
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
          <h3 className="text-xl font-bold mb-3 text-red-600 border-b pb-2">{title}</h3>
          <p className="text-sm font-semibold text-red-700 bg-red-50 p-3 rounded-lg mb-4">{warning}</p>

          <label htmlFor="securityPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Security Password to Proceed:
          </label>
          <input
            id="securityPassword"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            disabled={loading}
            // Add autoFocus to ensure the cursor is immediately placed in the input when the modal opens
            autoFocus 
            className="w-full p-3 border border-gray-400 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleConfirmAction()}
          />
          
          {modalError && <p className="text-red-600 text-sm mb-3">{modalError}</p>}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg font-semibold transition ${isPromote ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} disabled:bg-gray-400`}
            >
              Confirm & {isPromote ? 'Promote' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
};

export default function Other() {
  const ADMIN_PASSWORD = "admin123"; // Mock password for confirmation
  
  const [deleteYear, setDeleteYear] = useState(new Date().getFullYear() - 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [modalError, setModalError] = useState(null);

  const currentYear = new Date().getFullYear();

  // --- Modal Logic ---

  const handleConfirmAction = () => {
  if (passwordInput !== ADMIN_PASSWORD) {
    setModalError("Incorrect security password. Operation aborted.");
    return;
  }

  setModalError(null);
  setIsModalOpen(false);
  setLoading(true);
  setMessage(null);

  if (modalAction === "promote") {
    // Promote all eligible students
    fetch(`${import.meta.env.VITE_SERVER_URL}/students/promote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to promote students");
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setMessage({ type: "success", text: data.message });
      })
      .catch((error) => {
        setLoading(false);
        setMessage({ type: "error", text: error.message });
      });

  } else if (modalAction === "delete") {
    // Delete graduates of the selected admission year
    fetch(`${import.meta.env.VITE_SERVER_URL}/students/delete/${deleteYear}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete graduate records");
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setMessage({ type: "warning", text: data.message });
      })
      .catch((error) => {
        setLoading(false);
        setMessage({ type: "error", text: error.message });
      });
  }
};


  const handlePromotionClick = () => {
    setModalAction('promote');
    setModalError(null);
    setPasswordInput('');
    setIsModalOpen(true);
  };

  const handleDeleteGraduatesClick = () => {
    setModalAction('delete');
    setModalError(null);
    setPasswordInput('');
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
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
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Administrative Tools</h1>
        <p className="text-lg text-gray-500 mb-10">Manage end-of-year tasks and database maintenance.</p>
        
        {/* Message Alert */}
        {message && (
          <div className={`p-4 mb-6 rounded-xl shadow-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} border transition duration-300`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Promote Students */}
          <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Promote Students to Next Class
            </h2>
            <p className="text-gray-600 mb-6">
              Automatically advances ALL students to the next class level (e.g., Class 6 to 7). This action is irreversible.
            </p>

            <div className="space-y-4">
              
              <button
                onClick={handlePromotionClick}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Promotion...</span>
                  </>
                ) : (
                  <span>Promote ALL Students</span>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Delete Graduated Students / Cleanup */}
          <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-500">
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Database Cleanup & Archiving
            </h2>
            <p className="text-gray-600 mb-6">
              Permanently delete or archive records for students who graduated in a specified year. Use with caution.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="deleteYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Admission Year of Graduates to Delete
                </label>
                <select
                  id="deleteYear"
                  value={deleteYear}
                  onChange={(e) => setDeleteYear(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition"
                >
                  {/* Generate options for last 10 years */}
                  {[...Array(10)].map((_, i) => {
                    const year = currentYear - i - 1;
                    return <option key={year} value={year}>Graduated: {year}</option>;
                  })}
                </select>
              </div>

              <button
                onClick={handleDeleteGraduatesClick}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Deleting Records...</span>
                  </>
                ) : (
                  <span>Delete Graduated Records</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Other Tools Placeholder */}
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Other Tools & Configuration</h3>
          <p className="text-gray-600">
            This section can be expanded for tasks like managing staff accounts, updating school holidays, or bulk importing data.
          </p>
          <button className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
            View Settings
          </button>
        </div>
      </div>
    </div>
  );
}
