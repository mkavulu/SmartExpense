import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import API from "../api/axios";

export default function TransactionForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    transaction_type: "expense",
    category: "",
    date: "",
  });
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    API.get("categories/").then((res) => setCategories(res.data));
  }, []);

  const onDrop = (acceptedFiles) => setReceipt(acceptedFiles[0]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("amount", form.amount);
    formData.append("type", form.transaction_type); // backend expects "type"
    formData.append("category", form.category);
    formData.append("date", form.date);
    if (receipt) formData.append("receipt", receipt);

    await API.post("transactions/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setForm({
      title: "",
      amount: "",
      transaction_type: "expense",
      category: "",
      date: "",
    });
    setReceipt(null);

    if (onSuccess) onSuccess();
  };

  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(
    (c) => c.type === form.transaction_type
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Transaction
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <TextField
          label="Amount (Ksh)"
          type="number"
          fullWidth
          margin="normal"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <TextField
          label="Transaction Type"
          select
          fullWidth
          margin="normal"
          value={form.transaction_type}
          onChange={(e) =>
            setForm({ ...form, transaction_type: e.target.value, category: "" })
          }
          InputLabelProps={{ style: { color: "#000" } }}
          SelectProps={{ style: { color: "#000" } }}
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>

        <TextField
          label="Category"
          select
          fullWidth
          margin="normal"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          InputLabelProps={{ style: { color: "#000" } }}
          SelectProps={{ style: { color: "#000" } }}
        >
          <MenuItem value="">Select Category</MenuItem>
          {filteredCategories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {`${cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}: ${
                cat.name
              }`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            mt: 2,
          }}
        >
          <input {...getInputProps()} />
          {receipt ? (
            <Typography>Uploaded: {receipt.name}</Typography>
          ) : (
            <Typography>
              Drag & drop receipt image here, or click to select
            </Typography>
          )}
        </Box>

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Add
        </Button>
      </form>
    </Paper>
  );
}
