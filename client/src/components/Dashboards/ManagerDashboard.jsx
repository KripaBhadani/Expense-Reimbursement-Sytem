import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";  // Import axios

const ManagerDashboard = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingClaims = async () => {
      try {
        const response = await axios.get("/api/claims/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }); // Fetch pending claims
        setPendingClaims(response.data.claims);  // Assuming the response is in { claims: [...] }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Please login again.");
          window.location.href = "/login";
        }
        console.error("Error fetching pending claims:", error);
      }
    };
    fetchPendingClaims();
  }, []);

  const handleApprove = async (claimId) => {
    try {
      await axios.post(`/api/claims/approve/${claimId}`);
      alert("Claim Approved");
    } catch (error) {
      console.error("Error approving claim:", error);
    }
  };

  const handleReject = async (claimId) => {
    try {
      await axios.post(`/api/claims/reject/${claimId}`);
      alert("Claim Rejected");
    } catch (error) {
      console.error("Error rejecting claim:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manager Dashboard</h2>
      <h3 className="mt-4">Pending Claims</h3>
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
          {pendingClaims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.id}</td>
              <td>{claim.description}</td>
              <td>${claim.amount}</td>
              <td>
                <Button variant="success" onClick={() => handleApprove(claim.id)}>
                  Approve
                </Button>
                <Button variant="danger" onClick={() => handleReject(claim.id)}>
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManagerDashboard;
