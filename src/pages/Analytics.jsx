import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { Container, Typography, Paper } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#af52bf"];

export default function Analytics() {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);

  const { year, month } = useParams();

  useEffect(() => {
    // Expense by category (Pie Chart)
    API.get("analytics/category-totals/?type=expense").then((res) =>
      setPieData(res.data.results.map((r) => ({ name: r.category, value: r.total })))
    );

    // Monthly breakdown by category (Stacked bar chart)
    API.get("analytics/monthly-category/?type=expense").then((res) =>
      setBarData(res.data.results)
    );

    // Budget vs Expense (Double pie)
    if (year && month) {
      API.get(`analytics/budget/${year}/${month}/`).then((res) =>
        setBudgetData(res.data)
      );
    }
  }, [year, month]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Expense Analytics
      </Typography>

      {/* Expense by Category */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">By Category</Typography>
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Paper>

      {/* Monthly Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Monthly Breakdown</Typography>
        <BarChart width={600} height={300} data={barData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {barData.length > 0 &&
            Object.keys(barData[0])
              .filter((k) => k !== "month")
              .map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={COLORS[i % COLORS.length]}
                  stackId="a"
                />
              ))}
        </BarChart>
      </Paper>

      {/* Budget vs Expense */}
      {budgetData.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">
            Budget vs Expense ({month}/{year})
          </Typography>

          <PieChart width={400} height={300}>
            <Pie
              data={budgetData}
              dataKey="spent"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#FF8042"
            />
            <Pie
              data={budgetData}
              dataKey="budget"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#8884d8"
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </Paper>
      )}
    </Container>
  );
}
