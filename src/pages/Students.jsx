import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Students() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/students/class-strength")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        // Assuming the API returns an object like { classes: [...] }
        if (Array.isArray(data.classes)) {
          setClasses(data.classes);
        } else {
          // Fallback if the data is a direct array
          setClasses(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching class strength:", err);
        setError("Failed to load class data. Please try again later.");
        setLoading(false);
      });
  }, []);

  // console.log(classes);

  return (
    <div className="flex flex-col min-h-[84vh]">
      <main className="flex-grow p-8 bg-blue-100">
        <h1 className="text-4xl font-bold mb-8 text-center">Student Strength</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {classes.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No classes found.
              </p>
            ) : (
              classes.map((cls) => (
                <Link
                  key={cls.name}
                  to={`/students/${cls.name}`}
                  className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="text-xl font-semibold text-blue-600">Class {cls.name}</h2>
                  <p className="text-gray-600 mt-2">
                    Student Strength:{" "}
                    <span className="font-bold">{cls.studentsCount}</span>
                  </p>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}