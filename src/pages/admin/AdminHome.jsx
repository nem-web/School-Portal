import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

// --- Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;
const UserClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;
const VerifiedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const DotsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>;

export default function AdminHome() {
    const [allStudents, setAllStudents] = useState([]);
    const [allUnverifiedStudents, setAllUnverifiedStudents] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchError, setSearchError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const BASE_URL = import.meta.env.VITE_SERVER_URL;

        const fetchStudents = async () => {
            try {
                // Simulate network delay for smooth skeleton transition
                await new Promise(resolve => setTimeout(resolve, 600)); 
                const res = await fetch(`${BASE_URL}/students`);
                if (!res.ok) throw new Error("Failed to fetch students");
                const data = await res.json();
                
                const verifiedData = data.filter(student => student.isVerified && !student.isGraduated);
                const unverifiedData = data.filter(student => !student.isVerified && !student.isGraduated);

                setAllStudents(verifiedData);
                setAllUnverifiedStudents(unverifiedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to load student data.");
                setLoading(false);
            }
        };
        fetchStudents();
    }, [user]);

    // --- Action Handlers ---

    const handleDelete = async (id, isUnverifiedList) => {
        if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;

        try {
            const BASE_URL = import.meta.env.VITE_SERVER_URL;
            const res = await fetch(`${BASE_URL}/students/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");

            // Update local state based on which list the student was in
            if (isUnverifiedList) {
                setAllUnverifiedStudents(prev => prev.filter(s => s._id !== id));
            } else {
                setAllStudents(prev => prev.filter(s => s._id !== id));
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student.");
        }
    };

    const handleVerify = async (id) => {
        if (!window.confirm("Verify this student? They will be moved to the active list.")) return;

        try {
            const BASE_URL = import.meta.env.VITE_SERVER_URL;
            const res = await fetch(`${BASE_URL}/students/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: true }),
            });
            if (!res.ok) throw new Error("Update failed");

            // Move from unverified to verified list locally
            const studentToMove = allUnverifiedStudents.find(s => s._id === id);
            if (studentToMove) {
                setAllUnverifiedStudents(prev => prev.filter(s => s._id !== id));
                setAllStudents(prev => [...prev, { ...studentToMove, isVerified: true }]);
            }
        } catch (error) {
            console.error("Error verifying student:", error);
            alert("Failed to verify student.");
        }
    };

    const handleSearch = () => {
        setSearchError(null);
        const input = searchId.trim();
        // Search in both lists
        const foundStudent = [...allStudents, ...allUnverifiedStudents].find((s) => 
            s.serialNumber === input || s._id === input
        );

        if (foundStudent) {
            navigate(`/students/profile/${foundStudent._id}`); 
        } else {
            setSearchError("Student ID or Serial Number not found.");
        }
    };

    // --- Loading & Error States ---

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                <div className="flex-grow p-8 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
                    <div className="flex justify-between items-center">
                         <div className="h-10 bg-slate-200 rounded w-1/3"></div>
                         <div className="flex gap-3">
                             <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                             <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                         </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-32 bg-slate-200 rounded-2xl"></div>
                        <div className="h-32 bg-slate-200 rounded-2xl"></div>
                    </div>
                    <div className="h-96 bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Retry</button>
                </div>
            </div>
        );
    }

    // --- Main UI ---

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header with Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage enrollments and verification.</p>
                    </div>
                    
                    {/* Action Buttons Group */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => navigate('/other-admin')} 
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors shadow-sm"
                        >
                            <DotsIcon /> <span>Options</span>
                        </button>
                        
                        <button 
                            onClick={handleLogout} 
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm"
                        >
                            <LogoutIcon /> <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Pending Verification</p>
                            <h2 className="text-3xl font-bold text-orange-600">{allUnverifiedStudents.length}</h2>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <UserClockIcon />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Active Students</p>
                            <h2 className="text-3xl font-bold text-emerald-600">{allStudents.length}</h2>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <VerifiedIcon />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quick Lookup</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Serial Number or Student ID..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Search
                        </button>
                    </div>
                    {searchError && (
                        <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                             <span>⚠️</span> {searchError}
                        </div>
                    )}
                </div>

                {/* 1. Pending Verification Table */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-900">Pending Verification</h2>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-orange-50/50">
                                    <tr>
                                        {["S.No", "Name", "Class", "DOB", "Actions"].map((head) => (
                                            <th key={head} className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {allUnverifiedStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                                No pending verifications.
                                            </td>
                                        </tr>
                                    ) : (
                                        allUnverifiedStudents.map((s, i) => (
                                            <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-500">{i + 1}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{s.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">Class {s.class}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{s.dob}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                    <button onClick={() => navigate(`/students/profile/${s._id}`)} title="View" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <EyeIcon />
                                                    </button>
                                                    <button onClick={() => handleVerify(s._id)} title="Verify" className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors">
                                                        <CheckIcon />
                                                    </button>
                                                    <button onClick={() => handleDelete(s._id, true)} title="Delete" className="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition-colors">
                                                        <TrashIcon />
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

                {/* 2. All Students Table */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-900">Active Students</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {["S.No", "Serial", "Name", "Class", "DOB", "Actions"].map((head) => (
                                            <th key={head} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {allStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                No active students found.
                                            </td>
                                        </tr>
                                    ) : (
                                        allStudents.map((s, i) => (
                                            <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-500">{i + 1}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{s.serialNumber || "-"}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{s.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">Class {s.class}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{s.dob}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                    <button onClick={() => navigate(`/students/profile/${s._id}`)} title="View" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <EyeIcon />
                                                    </button>
                                                    <button onClick={() => handleDelete(s._id, false)} title="Delete" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <TrashIcon />
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

            </div>
        </div>
    );
}