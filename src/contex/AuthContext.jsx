import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access");
    return token ? jwtDecode(token) : null;
  });

  const login = (token) => {
    localStorage.setItem("access", token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem("access");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
