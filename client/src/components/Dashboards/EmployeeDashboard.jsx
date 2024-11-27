import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";

const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch claims from the server
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/claims");
        setClaims(response.data.claims);
      } catch (error) {
        console.error("Error fetching claims:", error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login if unauthorized
        } 
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaims();
  }, []);

  // Download report
  const downloadReport = async () => {
    setReportLoading(true);
    try {
      const response = await axiosInstance.get("/claims/report", {
        responseType: "blob", // Handle binary data
      });

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "claims_report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element
    } catch (error) {
      console.error("Error downloading report:", error.response?.data?.message || error.message);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Employee Dashboard</h2>
      <div className="d-flex justify-content-between">
        <Link to="/submit-claim">
          <Button variant="primary">Submit New Claim</Button>
        </Link>
        <Button variant="secondary" onClick={downloadReport} disabled={reportLoading}>
          {reportLoading ? "Downloading..." : "Download Report"}
        </Button>
      </div>
      <h3 className="mt-4">Submitted Claims</h3>
      {loading ? <p>Loading claims...</p> : claims.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Description</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.description}</td>
                <td>{claim.status}</td>
                <td>${claim.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No claims submitted yet.</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;
