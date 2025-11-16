import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("auth/register/", form);
      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Try a different username/email.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Create Account
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
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <TextField
            label="Confirm Password"
            fullWidth
            type="password"
            margin="normal"
            value={form.password2}
            onChange={(e) => setForm({ ...form, password2: e.target.value })}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>

          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}
        </form>
      </Box>
    </Container>
  );
}
