import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";  // Import axios

const ManagerDashboard = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [requestedInfo, setRequestedInfo] = useState("");
  const [expenseIdForRequest, setExpenseIdForRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);  // State for controlling modal visibility

  useEffect(() => {
    const fetchPendingClaims = async () => {
      try {
        const response = await axiosInstance.get("/claims/pending"); // Fetch pending claims
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
      const response = await axiosInstance.put(`/claims/${claimId}`, { status: "Approved" });
      console.log(response);
      alert("Claim Approved");
      // Refresh the list of pending claims
      setPendingClaims((prevClaims) => prevClaims.filter((claim) => claim.id !== claimId));
    } catch (error) {
      console.error("Error approving claim:", error);
      alert("Failed to approve the claim");
    }
  };

  const handleReject = async (claimId) => {
    try {
      const response = await axiosInstance.put(`/claims/${claimId}`, { status: "Rejected" });
      console.log(response);
      alert("Claim Rejected");
      // Refresh the list of pending claims
      setPendingClaims((prevClaims) => prevClaims.filter((claim) => claim.id !== claimId));
    } catch (error) {
      console.error("Error rejecting claim:", error);
      alert("Failed to reject the claim");
    }
  };

const handleRequestInfo = async (claimId, requestedInfo) => {
    try {
        const response = await axiosInstance.put(`/claims/${claimId}/request-info`, { requestedInfo });
        console.log(response);
        
        alert("Additional Information Requested Successfully!");
        setPendingClaims((prevClaims) => prevClaims.map((claim) => claim.id === claimId ? { ...claim, requestedInfo } : claim));
    } catch (error) {
      console.error("Error requesting additional information:", error);
      alert("Failed to request additional information");
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
                <Button
                  variant="info"
                  onClick={() => {
                    setExpenseIdForRequest(claim.id);
                    setShowModal(true); // Show the modal when "Request Info" is clicked
                  }}
                >
                  Request Info
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for entering requested information */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Additional Information</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter the additional information requested"
                  value={requestedInfo}
                  onChange={(e) => setRequestedInfo(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleRequestInfo(expenseIdForRequest, requestedInfo);
                    setRequestedInfo(""); // Reset the input after submission
                    setExpenseIdForRequest(null);
                    setShowModal(false); // Close the modal
                  }}
                >
                  Request Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;