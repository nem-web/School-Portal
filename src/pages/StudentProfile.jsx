import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { getCurrentClass } from "../classUtils.js";


export default function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const { user } = useContext(AuthContext); // user.isAdmin = true/false

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

  const handleEdit = () => {
    // Redirect to Register page with state
    navigate("/register", { state: { studentData: student } });
  };

  // In StudentProfile.jsx
  const handleViewIdCard = () => {
      if (student) {
          // Navigate to the ID card page with the student's ID in the URL
          navigate(`/idcard/${student._id}`);
      } else {
          console.warn("Student data not loaded yet. Cannot navigate.");
      }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* <Header /> */}
        <main className="flex-grow flex justify-center items-center bg-blue-100">
          <p className="text-xl text-gray-600">Loading student details...</p>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* <Header /> */}
        <main className="flex-grow flex justify-center items-center bg-blue-100">
          <p className="text-xl text-red-500 font-semibold">Student not found.</p>
          <Link
            to={`/students/${student?.class || "1"}`}
            className="text-blue-600 hover:underline ml-4"
          >
            ← Back to class
          </Link>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[84vh]">
      {/* <Header /> */}
      <main className="flex-grow p-8 bg-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Student Profile</h1>
            {/* The ID Card Button goes here */}
            <button
              onClick={handleViewIdCard}
              className="id-card-button ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              View ID Card
            </button>
            <button
              onClick={() => window.print()}
              className="print-button bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              🖨️ Print Profile
            </button>
            {user?.isAdmin && (
              <button
                onClick={handleEdit}
                className="edit-button ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            )}  
          </div>

          <div className="text-center mb-6">
            <img
              src={student.studentPhoto}
              alt={student.name}
              className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
            />
            <img
              src={student.studentSignature}
              alt="Signature"
              className="w-40 h-20 object-contain mx-auto mb-4 border"
            />
            <h2 className="text-2xl font-semibold text-blue-600">{student.name}</h2>
            <p className="text-gray-600">Class: {student.class}</p>
            <p className="text-gray-600">Serial No: {student.serialNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Mobile:</p>
              <p>{student.mobileNo || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Date of Birth:</p>
              <p>{student.dob}</p>
            </div>
            <div>
              <p className="font-semibold">Caste:</p>
              <p>{student.caste || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Address:</p>
              <p>{student.address || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Village:</p>
              <p>{student.village || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Block:</p>
              <p>{student.block || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">District:</p>
              <p>{student.district || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">State:</p>
              <p>{student.state || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Admission Year:</p>
              <p>{student.admissionYear || "-"}</p>
            </div>
          </div>

          {student.parents && student.parents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Parents Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.parents.map((p, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <p className="font-semibold">Name: {p.name}</p>
                    <p>Relation: {p.relation}</p>
                    <p>Mobile: {p.mobileNo || "-"}</p>
                    {p.photo && (
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-24 h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to={`/students/${student.class}`}
              className="no-print-header text-blue-600 hover:underline"
            >
              ← Back to class
            </Link>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
