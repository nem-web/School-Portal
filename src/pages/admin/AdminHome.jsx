import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'; // Ensure this path is correct

// MOCK: Placeholder data structure for students
const MOCK_STUDENTS = [
    { _id: "68da1ae6bbac5826eefc3da7", serialNumber: "2023SN001", name: "Alice Johnson", class: "12", dob: "2006-05-15" },
    { _id: "68da1ae6bbac5826eefc3da8", serialNumber: "2023SN002", name: "Bob Williams", class: "11", dob: "2007-11-20" },
    { _id: "68da1ae6bbac5826eefc3da9", serialNumber: "2024SN003", name: "Charlie Brown", class: "10", dob: "2008-02-01" },
];

/**
 * AdminHome component provides a search interface for students and a list of all students.
 */
export default function AdminHome() {
    const [allStudents, setAllStudents] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchError, setSearchError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const BASE_URL = import.meta.env.VITE_SERVER_URL; // ✅ correct for Vite

        const fetchStudents = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500)); 
                const res = await fetch(`${BASE_URL}/students`);
                if (!res.ok) throw new Error("Failed to fetch students");
                const data = await res.json();
                
                // --- Replace MOCK_STUDENTS with the result of: await res.json() ---
                setAllStudents(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to load student data.");
                setLoading(false);
            }
        };
        fetchStudents();
        // --- END MOCK DATA FETCH ---

    }, [user]);


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_SERVER_URL; // Mock URL reference

            // --- REAL DELETE LOGIC START ---
            const res = await fetch(`${BASE_URL}/students/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            // --- REAL DELETE LOGIC END ---

            setAllStudents((prev) => prev.filter((s) => s._id !== id));
        } catch (error) {
            console.error("Error deleting student:", error);
            // Use a custom UI element instead of alert in production
            alert("Failed to delete student. Check console for details."); 
        }
    };


    const handleSearch = () => {
        setSearchError(null);
        const input = searchId.trim();
        // Search by serial number or MongoDB _id
        const foundStudent = allStudents.find((s) => 
            s.serialNumber === input || s._id === input
        );

        if (foundStudent) {
            // MOCK: navigate to profile page. In a real app, you would fetch data using this ID.
            navigate(`/students/profile/${foundStudent._id}`); 
        } else {
            setSearchError("Student with this ID or Serial Number not found. Check the full list below.");
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-600 bg-gray-50 min-h-[84vh]">
                <p className="text-xl">Loading Admin Dashboard...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600 bg-gray-50 min-h-[84vh]">
                <p className="text-xl font-semibold">Error: {error}</p>
                <p className="text-sm mt-2">Please verify your server URL and API connection.</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 md:p-12 bg-gray-50 min-h-[84vh] max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold text-blue-800 mb-8 border-b-4 border-blue-100 pb-3">
                Admin Dashboard
            </h2>

            {/* Search Section */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-blue-200 mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    Search Student
                </h3>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Search by Serial Number or Database ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-grow p-3 border-2 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition shadow-inner"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-200 font-bold transform hover:scale-[1.01]"
                    >
                        Search
                    </button>
                </div>
                {searchError && (
                    <p className="text-red-600 mt-3 text-sm font-medium">{searchError}</p>
                )}
            </div>

            {/* Unverified Student List Section */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                    All Unverified Students
                    <span className="text-blue-600 text-sm font-semibold bg-blue-100 px-3 py-1 rounded-full">
                        Total: {allStudents.length}
                    </span>
                </h3>
                
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Serial No.</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {allStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-lg italic">
                                        No students registered yet.
                                    </td>
                                </tr>
                            ) : (
                                allStudents.map((s, i) => (
                                    <tr key={s._id} className="hover:bg-blue-50/50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{s.serialNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{s.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">Class {s.class}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.dob}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                                            <button
                                                onClick={() => navigate(`/students/profile/${s._id}`)}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150 cursor-pointer hover:underline"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="text-red-600 hover:text-red-800 font-semibold transition duration-150 cursor-pointer ml-2 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verified Student List Section */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                    All Registered Students 
                    <span className="text-blue-600 text-sm font-semibold bg-blue-100 px-3 py-1 rounded-full">
                        Total: {allStudents.length}
                    </span>
                </h3>
                
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Serial No.</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {allStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-lg italic">
                                        No students registered yet.
                                    </td>
                                </tr>
                            ) : (
                                allStudents.map((s, i) => (
                                    <tr key={s._id} className="hover:bg-blue-50/50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{s.serialNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{s.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">Class {s.class}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.dob}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                                            <button
                                                onClick={() => navigate(`/students/profile/${s._id}`)}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150 cursor-pointer hover:underline"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="text-red-600 hover:text-red-800 font-semibold transition duration-150 cursor-pointer ml-2 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
