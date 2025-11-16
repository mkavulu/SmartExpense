import { useState, useContext } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import API from "../api/axios";
import { AuthContext } from "../contex/AuthContext";
import { useNavigate } from "react-router-dom";

import "./PageStyles.css"; // Shared CSS background

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("auth/token/", form);
      login(res.data.access);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="page-container login-bg">
      <div className="page-content">

        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </form>

        {/* Register link */}
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </Typography>

      </div>
    </div>
  );
}
