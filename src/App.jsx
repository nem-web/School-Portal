import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Students from "./pages/Students";
import ClassStudents from "./pages/ClassStudents";
import StudentProfile from "./pages/StudentProfile";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import AdminHome from "./pages/admin/AdminHome";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import IdCard from "./components/IdCard";
import Other from "./pages/admin/Other";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 pb-20 lg:pb-0">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:classId" element={<ClassStudents />} />
          <Route path="/students/profile/:studentId" element={<StudentProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/other-admin" element={<Other />} />
          {/* In your App.jsx or routing file */}
          <Route path="/idcard/:studentId" element={<IdCard />} />
        </Routes>
        {/* <Footer /> */}
      </div>
      
    </AuthProvider>
  );
}

export default App;
