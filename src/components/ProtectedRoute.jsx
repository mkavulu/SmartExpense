import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}
