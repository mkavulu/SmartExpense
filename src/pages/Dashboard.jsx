import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    API.get("analytics/monthly/").then((res) => setSummary(res.data));
  }, []);

  return (
    <div className="page-container dashboard-bg">
      <div className="page-content">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Typography variant="h6">
          <b>Total Income:</b> Ksh {summary.income_total || 0}
        </Typography>

        <Typography variant="h6">
          <b>Total Expense:</b> Ksh {summary.expense_total || 0}
        </Typography>

        <Typography variant="h6">
          <b>Net:</b> Ksh {summary.net || 0}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/analytics")}
        >
          View Analytics
        </Button>
      </div>
    </div>
  );
}
