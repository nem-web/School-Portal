import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
// ----------------------------------------------------

export default function Header() {
  // Assuming AuthContext provides { user: { isAdmin: boolean }, logout: function }
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/students", label: "Students" },
    { to: "/register", label: "Register" },
  ];

  const NavItem = ({ to, label, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-white text-lg font-medium hover:text-cyan-300 transition duration-150 py-1"
    >
      {label}
    </Link>
  );

  // Inline SVG components to replace react-icons
  // --- START INLINE SVGs ---
  const IoIosLogIn = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11 7H13V17H11zM18.8 12.8L16 15.6V13H8V11H16V8.4L18.8 11.2C19.2 11.6 19.2 12.4 18.8 12.8M21 3H3C2.45 3 2 3.45 2 4V20C2 20.55 2.45 21 3 21H21C21.55 21 22 20.55 22 20V4C22 3.45 21.55 3 21 3M20 19H4V5H20V19Z"/></svg>;
  const RiLogoutBoxFill = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11H4V13H16V16L20 12L16 8V11M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"/></svg>;
  const FaUserShield = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M15 11.5L13.5 13L15 14.5L12 17.5L9 14.5L10.5 13L9 11.5L12 8.5L15 11.5Z"/></svg>;
  const FaBars = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 18H21V16H3V18M3 13H21V11H3V13M3 6V8H21V6H3Z"/></svg>;
  const FaTimes = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>;
  // --- END INLINE SVGs ---


  return (
    <header className="no-print-header sticky top-0 z-50 bg-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* Logo/Title */}
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wider">
          School Portal
        </Link>
        
        {/* Desktop Navigation & Admin Link */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
          
          {/* Admin Panel Link */}
          {user?.isAdmin && (
            <Link 
              to="/admin-panel" 
              className="flex items-center space-x-2 text-white bg-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
            >
              <FaUserShield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>
        
        {/* Login/Logout Button */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 px-4 py-2 text-sm rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105 shadow-md"
            >
              <RiLogoutBoxFill className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 bg-green-600 px-4 py-2 text-sm rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105 shadow-md"
            >
              <IoIosLogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Visible when isMenuOpen is true) */}
      <div
        className={`fixed top-16 right-0 w-64 h-full bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <NavItem
              key={link.to}
              to={link.to}
              label={link.label}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            />
          ))}

          {/* Admin Panel Link (Mobile) */}
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 text-white bg-blue-600 px-3 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition mt-4"
            >
              <FaUserShield className="w-5 h-5" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
