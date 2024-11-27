import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";  // Import axios

const FinanceDashboard = () => {
  const [approvedClaims, setApprovedClaims] = useState([]);

  useEffect(() => {
    const fetchApprovedClaims = async () => {
      try {
        const response = await axiosInstance.get("/claims/approved"); // Fetch approved claims
        setApprovedClaims(response.data.claims);  
      } catch (error) {
        console.error("Error fetching approved claims:", error);
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
