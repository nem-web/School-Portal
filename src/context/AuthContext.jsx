import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Login function (for demo, no real API)
  const login = (username, password) => {
    // In real app, call your backend API here
    // Example: fetch('/api/login', {method:'POST', body:{username,password}})
    // For demo, just accept username: admin, password: admin
    if ((username === "admin" && password === "admin") || (username === "user" && password === "user")) {
      const userData = {
        username,
        isAdmin: username === "admin" ? true : false,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
