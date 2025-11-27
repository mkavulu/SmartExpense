import { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Button,
  TableContainer,
} from "@mui/material";

import {
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Download,
} from "@mui/icons-material";

import API from "../api/axios";
import EditTransactionForm from "./EditTransactionForm";
import ExportService from "../services/exportService";
import { formatKsh } from "./utils/format"; // ✅ FIXED IMPORT

export default function TransactionList({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Edit modal
  const [editingTransaction, setEditingTransaction] = useState(null);

  // ✅ Load data function (fix for missing loadData)
  const loadData = async () => {
    const transRes = await API.get("transactions/");
    const catRes = await API.get("categories/");
    setTransactions(transRes.data);
    setFiltered(transRes.data);
    setCategories(catRes.data);
  };

  // Load when mounted or when "refresh" changes
  useEffect(() => {
    loadData();
  }, [refresh]);

  // Filter + sort
  useEffect(() => {
    let data = [...transactions];

    if (search) {
      data = data.filter((t) =>
        t.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) data = data.filter((t) => t.type === type);
    if (category) data = data.filter((t) => String(t.category) === String(category));
    if (dateFrom) data = data.filter((t) => t.date >= dateFrom);
    if (dateTo) data = data.filter((t) => t.date <= dateTo);

    // Safe sorting
    data.sort((a, b) => {
      const A = a[sortField];
      const B = b[sortField];

      if (A == null) return 1;
      if (B == null) return -1;

      if (sortDirection === "asc") return A > B ? 1 : -1;
      return A < B ? 1 : -1;
    });

    setFiltered(data);
  }, [search, type, category, dateFrom, dateTo, sortField, sortDirection, transactions]);

  // Sort toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortIcon = (field) =>
    sortField === field ? (
      sortDirection === "asc" ? (
        <ArrowUpward fontSize="small" />
      ) : (
        <ArrowDownward fontSize="small" />
      )
    ) : null;

  // Delete
  const handleDelete = async (id) => {
    await API.delete(`transactions/${id}/`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Transactions
      </Typography>

      {/* FILTERS */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={3}>
          <TextField
            label="Search"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            select
            fullWidth
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ minWidth: 140 }}   // <-- FIX
            InputLabelProps={{ style: { whiteSpace: "nowrap" } }} // optional
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
        </Grid>


        <Grid item xs={3}>
          <TextField
            select
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 140 }}   // <-- FIX
            InputLabelProps={{ style: { whiteSpace: "nowrap" } }} // optional
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={1.5}>
          <TextField
            type="date"
            fullWidth
            label="From"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </Grid>

        <Grid item xs={1.5}>
          <TextField
            type="date"
            fullWidth
            label="To"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* EXPORT BUTTONS */}
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={() => ExportService.exportCSV(filtered)}
        sx={{ mr: 2 }}
      >
        Export CSV
      </Button>

      <Button
        variant="outlined"
        onClick={() => ExportService.exportExcel(filtered)}
        sx={{ mr: 2 }}
      >
        Export Excel
      </Button>

      <Button variant="outlined" onClick={() => ExportService.exportPDF(filtered)}>
        Print / PDF
      </Button>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => toggleSort("title")}>
                Title {sortIcon("title")}
              </TableCell>
              <TableCell onClick={() => toggleSort("type")}>
                Type {sortIcon("type")}
              </TableCell>
              <TableCell onClick={() => toggleSort("category_name")}>
                Category {sortIcon("category_name")}
              </TableCell>
              <TableCell onClick={() => toggleSort("amount")}>
                Amount {sortIcon("amount")}
              </TableCell>
              <TableCell onClick={() => toggleSort("date")}>
                Date {sortIcon("date")}
              </TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Receipt</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell>{t.category_name}</TableCell>

                <TableCell
                  className={
                    t.type === "income"
                      ? "transaction-income"
                      : "transaction-expense"
                  }
                >
                  {formatKsh(t.amount)}
                </TableCell>

                <TableCell>{t.date}</TableCell>
                <TableCell>{t.note || "—"}</TableCell>

                <TableCell>
                  {t.receipt ? (
                    <img
                      src={t.receipt}
                      alt="receipt"
                      style={{ width: 80, height: "auto", borderRadius: 4 }}
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => setEditingTransaction(t)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(t.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EDIT MODAL */}
      {editingTransaction && (
        <EditTransactionForm
          transaction={editingTransaction}
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSaved={loadData} // ✅ reload after edit
        />
      )}
    </Paper>
  );
}
