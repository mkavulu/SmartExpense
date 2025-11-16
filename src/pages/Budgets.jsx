import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Typography,
  LinearProgress,
} from "@mui/material";
import API from "../api/axios";

export default function Budgets() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
  });

  useEffect(() => {
    API.get("categories/").then((res) => setCategories(res.data));
    API.get("budgets/").then((res) => setBudgets(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await API.post("budgets/", form);
    API.get("budgets/").then((res) => setBudgets(res.data));
  };

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Set Monthly Budget</Typography>

          <form onSubmit={submit}>
            <TextField
              select
              label="Category"
              fullWidth
              sx={{ mt: 2 }}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Amount"
              type="number"
              fullWidth
              sx={{ mt: 2 }}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <TextField
              type="month"
              fullWidth
              sx={{ mt: 2 }}
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value + "-01" })}
            />

            <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
              Save Budget
            </Button>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Budgets</Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Budget</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.category_name}</TableCell>
                  <TableCell>{b.month}</TableCell>
                  <TableCell>${b.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}
