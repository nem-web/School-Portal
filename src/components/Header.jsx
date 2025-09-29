import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IoIosLogIn } from "react-icons/io";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">School Portal</div>
      <nav className="flex space-x-4">
        <Link to="/" className="hover:text-gray-400">Home</Link>
        <Link to="/about" className="hover:text-gray-400">About</Link>
        <Link to="/students" className="hover:text-gray-400">Students</Link>
        <Link to="/register" className="hover:text-gray-400"> Register</Link>
      </nav>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-gray-750 text-1.2xl px-4 py-1 rounded hover:bg-gray-400 transition"
          >
            Login <IoIosLogIn className="inline-block ml-1" />
          </Link>
        )}
      </div>
    </header>
  );
}
