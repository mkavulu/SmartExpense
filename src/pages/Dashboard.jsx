import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch both monthly and monthly-summary
    Promise.all([
      API.get("analytics/monthly/"),
      API.get("analytics/monthly-summary/")
    ])
      .then(([monthlyRes, summaryRes]) => {
        // Merge both responses into one summary object
        setSummary({
          ...monthlyRes.data,
          ...summaryRes.data
        });
      })
      .catch(err => console.error("Error fetching analytics:", err));
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

        {/* Example: if monthly-summary returns extra fields */}
        {summary.transaction_count && (
          <Typography variant="h6">
            <b>Transactions:</b> {summary.transaction_count}
          </Typography>
        )}

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
