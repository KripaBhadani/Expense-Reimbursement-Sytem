import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import ProfileDropdown from "../ProfileDropdown";
import NotificationDropdown from "../../components/NotificationDropdown";

const FinanceDashboard = () => {
  const [approvedClaims, setApprovedClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchApprovedClaims = async () => {
      
      try {
        const claimsResponse = await axiosInstance.get("/claims/approved"); // Fetch approved claims
        const userId = localStorage.getItem("userId") || "";
        if (!userId) throw new Error("User not logged in");

        const notificationsResponse = await axiosInstance.get(`/notifications/${userId}`);
        setApprovedClaims(claimsResponse.data.claims);  
        setNotifications(notificationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data?.message || error.message);
        setErrorMessage(error.response?.data?.message || "Failed to load data.");
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login if unauthorized
        } else if (!error.response) {
          // Handle network error or server down scenario
          setErrorMessage("Network error. Please try again.");
        } 
      }
    };

    fetchApprovedClaims();
  }, []);

  const processClaim = async (claimId) => {
    try {
      await axiosInstance.post(`/claims/process/${claimId}`);
      alert("Claim Processed");
    } catch (error) {
      console.error("Error processing claim:", error);
    }
  };

  return (
    <div className="container mt-4">
      <nav className="navbar d-flex justify-content-between align-items-center">
        <h1>Finance Dashboard</h1>
        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
          {/* Notification Bell */}
          <NotificationDropdown notifications={notifications} />
          {/* Profile Icon */}
          <ProfileDropdown />
        </div>
      </nav>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <h3 className="mt-4">Approved Claims</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvedClaims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.id}</td>
              <td>{claim.description}</td>
              <td>${claim.amount}</td>
              <td>
                <Button variant="primary" onClick={() => processClaim(claim.id)}>
                  Process
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FinanceDashboard;
