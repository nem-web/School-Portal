import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// --- Icons ---
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;

export default function ClassStudents() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/students?class=${classId}`
        );
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        // Sort alphabetically
        data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classId]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Render Helpers ---

  const GridItem = ({ student }) => (
    <Link
      to={`/students/profile/${student._id}`}
      className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/4] overflow-hidden bg-slate-100">
        <img
          src={student.studentPhoto || "https://via.placeholder.com/150?text=No+Img"}
          alt={student.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          #{student.serialNumber || "NA"}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-sm md:text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {student.name}
        </h2>
        <div className="mt-auto pt-2 space-y-1">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-xs text-slate-400">DOB:</span> 
            {student.dob ? new Date(student.dob).toLocaleDateString() : "-"}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
             <PhoneIcon /> {student.mobileNo || "-"}
          </p>
        </div>
      </div>
    </Link>
  );

  const ListItem = ({ student }) => (
    <Link
      to={`/students/profile/${student._id}`}
      className="group bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex items-center gap-4"
    >
      <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
        <img
          src={student.studentPhoto || "https://via.placeholder.com/150?text=No+Img"}
          alt={student.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <h2 className="text-base font-bold text-slate-800 truncate group-hover:text-indigo-600">
          {student.name}
        </h2>
        <p className="text-xs text-slate-500">Roll No: {student.serialNumber || "-"}</p>
      </div>

      <div className="text-right hidden sm:block">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mobile</p>
        <p className="text-sm font-medium text-slate-700">{student.mobileNo || "-"}</p>
      </div>

      <div className="text-slate-300 group-hover:text-indigo-500 transition-colors pl-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );

  const LoadingSkeleton = () => (
    <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "flex flex-col space-y-3"}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`bg-slate-200 animate-pulse rounded-xl ${viewMode === 'grid' ? 'h-48' : 'h-20'}`}></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20 lg:pb-0">
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* --- Top Bar --- */}
        <div className="flex flex-col gap-4 mb-6">
          <Link to="/students" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors w-fit">
            <BackIcon />
            <span className="ml-1 text-sm font-medium">Back to Classes</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Class {classId}</h1>
              <p className="text-slate-500 text-sm">
                {students.length} Student{students.length !== 1 ? 's' : ''} Enrolled
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">No students found.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" 
            : "flex flex-col space-y-3"
          }>
            {filteredStudents.map((student) => (
              viewMode === "grid" ? (
                <GridItem key={student._id} student={student} />
              ) : (
                <ListItem key={student._id} student={student} />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}