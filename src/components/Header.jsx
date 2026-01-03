import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Configuration for Navigation Items
  const navItems = [
    { to: "/", label: "Home", icon: <FaHome className="w-6 h-6 mb-1" /> },
    { to: "/students", label: "Students", icon: <FaUserGraduate className="w-6 h-6 mb-1" /> },
    { to: "/register", label: "Register", icon: <FaClipboardList className="w-6 h-6 mb-1" /> },
  ];

  return (
    <>
      {/* ------------------ TOP HEADER ------------------ */}
      <header 
        className="no-print-header sticky top-0 z-50 h-16 transition-all duration-300
        /* Mobile: Ultra-modern frosted glass (Native App Feel) */
        bg-slate-900/70 backdrop-blur-2xl border-b border-white/5
        /* Desktop: Premium dark gradient with subtle depth */
        lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-900 lg:to-slate-950
        lg:border-b lg:border-indigo-500/10 lg:shadow-lg lg:shadow-indigo-500/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center gap-3 text-xl md:text-2xl font-extrabold tracking-tight transition-opacity hover:opacity-90"
          >
            {/* Optional: Add a small icon or shape here if desired, otherwise just text */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200 drop-shadow-sm group-hover:to-white">
              School Portal
            </span>
          </Link>

          {/* DESKTOP NAV: Hidden on Mobile/Tablet (< lg) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-sm font-bold tracking-wide transition-all duration-200 py-1 ${
                  isActive(item.to)
                    ? "text-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
                {/* Active Indicator Dot */}
                {isActive(item.to) && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
                )}
              </Link>
            ))}

            {/* Desktop Admin Links with Divider */}
            {user?.isAdmin && (
              <div className="flex items-center gap-3 pl-6 border-l border-slate-800/80">
                <Link 
                  to="/admin" 
                  className="flex items-center gap-1.5 text-white bg-indigo-600/90 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 hover:shadow-indigo-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <FaUserShield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
                <Link 
                  to="/other-admin" 
                  className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 border border-slate-700 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-700 hover:text-white transition-all"
                >
                  <FaEllipsisH className="w-3.5 h-3.5" />
                  <span>Tools</span>
                </Link>
              </div>
            )}
          </nav>

          {/* LOGIN/LOGOUT: HIDDEN on Mobile/Tablet (lg:flex) */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-2 rounded-lg text-sm font-bold hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200"
              >
                <RiLogoutBoxFill className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200"
              >
                <IoIosLogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ------------------ BOTTOM NAVIGATION (Mobile/Tablet Only) ------------------ */}
      {/* Visible on screens smaller than lg (< 1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 pb-safe-area shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)]">
        <div className="flex justify-around items-center h-16">
          
          {/* Main Tabs */}
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 ${
                isActive(item.to) 
                  ? "text-indigo-400" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <div className={`mb-1 transition-transform duration-200 ${isActive(item.to) ? '-translate-y-1 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]' : ''}`}>
                 {item.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${isActive(item.to) ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Conditional Admin Tab for Mobile */}
          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 ${
                isActive("/admin") 
                  ? "text-indigo-400" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <FaUserShield className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold tracking-wide opacity-70">Admin</span>
            </Link>
          )}

        </div>
      </nav>
    </>
  );
}

// ---------------- Icons ---------------- //

const FaHome = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const FaUserGraduate = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/></svg>;
const FaClipboardList = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H14.82C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M12 3C12.55 3 13 3.45 13 4S12.55 5 12 5 11 4.55 11 4 11.45 3 12 3M7 7H17V9H7V7M7 11H17V13H7V11M7 15H14V17H7V15Z"/></svg>;
const IoIosLogIn = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11 7H13V17H11zM18.8 12.8L16 15.6V13H8V11H16V8.4L18.8 11.2C19.2 11.6 19.2 12.4 18.8 12.8M21 3H3C2.45 3 2 3.45 2 4V20C2 20.55 2.45 21 3 21H21C21.55 21 22 20.55 22 20V4C22 3.45 21.55 3 21 3M20 19H4V5H20V19Z"/></svg>;
const RiLogoutBoxFill = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11H4V13H16V16L20 12L16 8V11M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"/></svg>;
const FaUserShield = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M15 11.5L13.5 13L15 14.5L12 17.5L9 14.5L10.5 13L9 11.5L12 8.5L15 11.5Z"/></svg>;
const FaEllipsisH = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z"/></svg>;