import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ClassStudents() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classNumber = classId;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/students?class=${classNumber}`
        );
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classNumber]);

  return (
    <div className="flex flex-col min-h-[84vh]">
      {/* <Header /> */}

      <main className="flex-grow p-8 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
            Students of Class {classNumber}
          </h1>

          <Link
            to="/students"
            className="inline-block mb-6 text-blue-600 hover:underline"
          >
            ← Back to all classes
          </Link>

          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {!loading && !error && students.length === 0 && (
            <p className="text-center text-gray-600">No students in this class.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Link
                key={student._id}
                to={`/students/profile/${student._id}`}
                className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={student.studentPhoto}
                  alt={student.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold text-blue-700">{student.name}</h2>
                <p className="text-gray-600 mt-1">DOB: {student.dob}</p>
                <p className="text-gray-600">Serial: {student.serialNumber}</p>
                <p className="text-gray-600">Mobile: {student.mobileNo || "-"}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
