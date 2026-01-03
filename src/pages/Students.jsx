import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// --- Icons ---
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;

export default function Students() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    
    fetch(`${BASE_URL}/students/class-strength`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // --- 🛡️ SAFETY CHECK START ---
        let classData = [];
        
        if (data && Array.isArray(data.classes)) {
            classData = data.classes;
        } else if (Array.isArray(data)) {
            classData = data;
        } else {
            console.warn("Unexpected API response structure:", data);
        }
        
        // Only sort if we have items
        if (classData.length > 0) {
            classData.sort((a, b) => parseInt(a?.name || 0) - parseInt(b?.name || 0));
        }
        // --- 🛡️ SAFETY CHECK END ---

        setClasses(classData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching class strength:", err);
        setError("Failed to load class data.");
        setLoading(false);
      });
  }, []);

  // Safe reduce for Total Count
  const totalStudents = (classes || []).reduce((sum, cls) => sum + (cls?.studentsCount || 0), 0);

  // --- Render Helpers ---
  
  const GridItem = ({ cls }) => (
    <Link
      to={`/students/${cls.name}`}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col items-center text-center group"
    >
      <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
        <UsersIcon />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-700">Class {cls.name}</h2>
      <p className="text-slate-500 text-sm font-medium">
        Strength: <span className="text-slate-900 font-bold">{cls.studentsCount}</span>
      </p>
    </Link>
  );

  const ListItem = ({ cls }) => (
    <Link
      to={`/students/${cls.name}`}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex justify-between items-center group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <UsersIcon />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700">Class {cls.name}</h2>
          <p className="text-xs text-slate-400">View Residents</p>
        </div>
      </div>
      <div className="text-right">
        <span className="block text-2xl font-bold text-slate-800">{cls.studentsCount}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase">Students</span>
      </div>
    </Link>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-slate-200 h-40 rounded-2xl"></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20 lg:pb-0">
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* --- Header Section --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Resident Groups</h1>
          <p className="text-slate-500 mt-1">Manage student occupancy by class.</p>
        </div>

        {/* --- Controls & Stats Bar --- */}
        <div className="flex flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          
          {/* Total Stats */}
          <div className="flex items-center gap-3">
             <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                <UsersIcon />
             </div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Total Residents</p>
                <p className="text-xl font-bold text-slate-800">{loading ? "..." : totalStudents}</p>
             </div>
          </div>

          {/* View Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid View"
            >
              <GridIcon />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
              title="List View"
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 text-red-700 underline text-sm">Retry</button>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg">No classes found.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col space-y-3"}>
            {classes.map((cls) => (
              viewMode === "grid" ? (
                <GridItem key={cls.name} cls={cls} />
              ) : (
                <ListItem key={cls.name} cls={cls} />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}