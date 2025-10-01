import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
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

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:classId" element={<ClassStudents />} />
        <Route path="/students/profile/:studentId" element={<StudentProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminHome />} />
        {/* In your App.jsx or routing file */}
        <Route path="/idcard/:studentId" element={<IdCard />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
