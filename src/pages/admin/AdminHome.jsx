import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { AuthContext } from "../../context/AuthContext"; // optional


/**
 * AdminHome component provides a search interface for students and a list of all students.
 * @param {function} onSelectStudent - Callback function to open the details page for a student.
 * @param {Array} allStudents - List of all registered students.
 * @param {function} deleteStudent - Function to delete a student.
 */
export default function AdminHome({ onSelectStudent }) {
  const [allStudents, setAllStudents] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState(null);

  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext); // user.isAdmin = true/false

  useEffect(() => {
    fetch("http://localhost:3001/api/students")
      .then((res) => res.json())
      .then((data) => {
        setAllStudents(data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/students/${id}`, {
        method: "DELETE",
      });
      setAllStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

 const handleSearch = () => {
    setSearchError(null);
    const input = searchId.trim();
    const foundStudent = allStudents.find((s) => s.serialNumber === input);
    // console.log("Searching for ID:", input, "Found:", foundStudent);
    if (foundStudent) {
      navigate(`/students/profile/${foundStudent._id}`); // ✅ Redirect to student page
    } else {
      setSearchError("Student with this Serial Number not found. Check the full list below.");
    }
  };

  // console.log("All Students:", allStudents);


  return (
    <>
    <div className="p-6 bg-white min-h-[80vh]">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">
        Admin Dashboard
      </h2>

      {/* Search Section */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-inner mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">
          Search Student by Serial/Database ID
        </h3>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Enter Student ID (e.g., MongoDB _id)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Search
          </button>
        </div>
        {searchError && (
          <p className="text-red-600 mt-3 text-sm font-medium">{searchError}</p>
        )}
      </div>

      {/* Student List Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          All Registered Students ({allStudents.length})
        </h3>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No students registered yet.</td>
                </tr>
              ) : (
                allStudents.map((s, i) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Class {s.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.dob}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                      <button
                        onClick={() => navigate(`/students/profile/${s._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium transition duration-150 cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 hover:text-red-900 font-medium transition duration-150 ml-2 cursor-pointer"
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
    </>
  );
}
