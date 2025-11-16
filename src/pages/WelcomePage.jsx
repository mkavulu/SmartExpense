import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Smart Expense Tracker</h1>

        <p className="welcome-description">
          Track your expenses, analyze your spending habits, manage budgets,
          and stay financially in control — all in one sleek dashboard.
        </p>

        <div className="welcome-buttons">
          <button className="btn primary" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="btn secondary" onClick={() => navigate("/register")}>
            Create Account
          </button>
        </div>
      </div>

      <div className="welcome-footer">
        <p>© {new Date().getFullYear()} Smart Expense. All rights reserved.</p>
      </div>
    </div>
  );
};

export default WelcomePage;
