import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import LandingPage from "./components/LandingPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import EmployeeDashboard from "./components/Dashboards/EmployeeDashboard";
import ManagerDashboard from "./components/Dashboards/ManagerDashboard";
import FinanceDashboard from "./components/Dashboards/FinanceDashboard";
import { checkRoleAccess } from "./utils/Auth"; // Utility function for role validation
import ExpenseForm from "./components/ExpenseForm";

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // New state for loading

  // eslint-disable-next-line react-hooks/exhaustive-deps
  console.log("Local Storage Role:", localStorage.getItem("role"));
    console.log("State UserRole:", userRole);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token from localStorage:", token); // Check if token exists
    
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode JWT to extract role
        // console.log("Decoded Token:", decoded);
        setUserRole(decoded.role); // Set the user's role in state
        // console.log("Decoded UserRole:", decoded.role); // Debugging info
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Clear invalid token
      }
    }
    setLoading(false); // Set loading to false after processing token
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading while waiting for token
  }
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based dashboard routes */}
        <Route
          path="/dashboard/employee"
          element={<EmployeeDashboard />}
            // checkRoleAccess(userRole, ["employee"]) ? <EmployeeDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/manager"
          element={<ManagerDashboard />}
            // checkRoleAccess(userRole, ["manager"]) ? <ManagerDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/finance"
          element={<FinanceDashboard />}
            // checkRoleAccess(userRole, ["finance"]) ? <FinanceDashboard /> : <Navigate to="/" />}
        />
        <Route path="/submit-claim" element={<ExpenseForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

