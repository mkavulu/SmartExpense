import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ fixed path

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If user exists, render children; otherwise redirect to login
  return user ? children : <Navigate to="/login" />;
}
