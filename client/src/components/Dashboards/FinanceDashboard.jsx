import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";  // Import axios

const FinanceDashboard = () => {
  const [approvedClaims, setApprovedClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApprovedClaims = async () => {
      try {
        const response = await axios.get("/api/claims/approved", {
          headers: { Authorization: `Bearer ${token}` },
        }); // Fetch approved claims
        setApprovedClaims(response.data.claims);  // Assuming the response is in { claims: [...] }
      } catch (error) {
        console.error("Error fetching approved claims:", error);
      }
    };
    fetchApprovedClaims();
  }, []);

  const processClaim = async (claimId) => {
    try {
      await axios.post(`/api/claims/process/${claimId}`);
      alert("Claim Processed");
    } catch (error) {
      console.error("Error processing claim:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Finance Dashboard</h2>
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
