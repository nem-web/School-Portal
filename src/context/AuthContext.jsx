import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login function (demo version)
  const login = (username, password) => {
    // Replace this with real API in production
    if (
      (username === "admin" && password === "admin") ||
      (username === "user" && password === "user")
    ) {
      const userData = {
        username,
        isAdmin: username === "admin",
      };
      setUser(userData);
      return { success: true, user: userData };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  const logout = () => {
    setUser(null);
    // localStorage is cleared automatically in the effect above
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
