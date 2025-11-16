import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { getTheme } from "./theme";

import { AuthProvider } from "./contex/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import WelcomePage from "./pages/WelcomePage";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// -----------------------
// Content with conditional Navbar
// -----------------------
function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Only show Navbar if not on WelcomePage */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// -----------------------
// Main App with Theme Toggle
// -----------------------
export default function App() {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved) setMode(saved);
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Theme Toggle Button */}
        <IconButton
          onClick={toggleTheme}
          sx={{ position: "fixed", top: 10, right: 10, zIndex: 2000 }}
          color="inherit"
        >
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>

        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
