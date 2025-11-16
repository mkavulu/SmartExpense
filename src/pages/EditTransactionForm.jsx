import { useState, useEffect } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import API from "../api/axios";

export default function EditTransactionForm({ transaction, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...transaction });

  useEffect(() => {
    API.get("categories/").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`transactions/${transaction.id}/`, form);
    onSaved();
  };

  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(
    (c) => c.type === form.transaction_type
  );

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <TextField
        label="Amount"
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
            {`${cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}: ${cat.name}`}
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

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </form>
  );
}
