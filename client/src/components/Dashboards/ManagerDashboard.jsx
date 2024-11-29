import React, { useState, useEffect } from "react";
import { Button, Table, Spinner, Modal } from "react-bootstrap";
import NotificationDropdown from "../../components/NotificationDropdown";
import axiosInstance from "../../utils/axiosInstance";  // Import axios
import jsPDF from "jspdf";
import { utils, writeFile } from "xlsx";
import ProfileDropdown from "../ProfileDropdown";


const ManagerDashboard = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [requestedInfo, setRequestedInfo] = useState("");
  const [expenseIdForRequest, setExpenseIdForRequest] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);  // State for controlling modal visibility
  const [reportData, setReportData] = useState([]); // State for storing report data
  const [showReportModal, setShowReportModal] = useState(false);
  const [notifications, setNotifications] = useState([]); // State for storing notifications
  const [reportLoading, setReportLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingClaims, setLoadingClaims] = useState({});
  

  // Fetch Pending claims
  useEffect(() => {
    const fetchPendingClaims = async () => {
      try {
        const response = await axiosInstance.get("/claims/pending"); // Fetch pending claims
        setPendingClaims(response.data.claims);
      } catch (error) {
        console.error("Error fetching pending claims:", error);
        setErrorMessage("Failed to fetch pending claims. Please try again.");
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Redirecting to login...");
          window.location.href = "/login";
        }
      }
    };
    fetchPendingClaims();
  }, []);

   // Fetch manager's expense report
  const fetchManagerExpenseReport = async () => {
    setReportLoading(true);
    try {
      const response = await axiosInstance.get("/reports/manager");
      setReportData(response.data); 
    } catch (error) {
      console.error("Error fetching manager expense report:", error);
      setErrorMessage("Failed to fetch expense report.");
    } finally {
      setReportLoading(false);
    }
  };

  // Approve claim
  const handleApprove = async (claimId) => {
    setLoadingClaims((prev) => ({ ...prev, [`approve_${claimId}`]: true }));
    try {
      await axiosInstance.put(`/claims/${claimId}`, { status: "Approved" });
      alert("Claim Approved");
      setPendingClaims((prevClaims) => prevClaims.filter((claim) => claim.id !== claimId));
    } catch (error) {
      console.error("Error approving claim:", error);
      alert("Failed to approve the claim");
    }finally {
      setLoadingClaims((prev) => ({ ...prev, [`approve_${claimId}`]: false })); // Set loading to false after processing
    }
  };

  // Reject claim
  const handleReject = async (claimId) => {
    setLoadingClaims((prev) => ({ ...prev, [`reject_${claimId}`]: true }));
    try {
      await axiosInstance.put(`/claims/${claimId}`, { status: "Rejected" });
      alert("Claim Rejected");
      setPendingClaims((prevClaims) => prevClaims.filter((claim) => claim.id !== claimId));
    } catch (error) {
      console.error("Error rejecting claim:", error);
      alert("Failed to reject the claim");
    }finally {
      setLoadingClaims((prev) => ({ ...prev, [`reject_${claimId}`]: false })); // Set loading to false after processing
    }
  };

  // Request additional information
const handleRequestInfo = async (claimId, requestedInfo) => {
  setLoadingClaims((prev) => ({ ...prev, [`submit_${claimId}`]: true }));
    try {
        await axiosInstance.put(`/claims/${claimId}/request-info`, { requestedInfo });
        
        alert("Additional Information Requested Successfully!");
        setPendingClaims((prevClaims) => prevClaims.map((claim) => claim.id === claimId ? { ...claim, requestedInfo } : claim));
        setShowInfoModal(false);
    } catch (error) {
      console.error("Error requesting additional information:", error);
      alert("Failed to request additional information");
    } finally {
      setLoadingClaims((prev) => ({ ...prev, [`submit_${claimId}`]: false })); // Set loading to false after processing
    }
};

// Function to generate and download PDF report
const downloadPDFReport = () => {
  const doc = new jsPDF();
  doc.text("Manager Expense Report", 20, 10);
  reportData.forEach((expense, index) => {
    doc.text(`${expense.userId} - ${expense.amount} - ${expense.status}`, 20, 20 + index * 10);
  });
  doc.save("manager_expense_report.pdf");
};

// Function to generate and download CSV report
const downloadCSVReport = () => {
  const ws = utils.json_to_sheet(reportData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Expense Report");
  writeFile(wb, "manager_expense_report.xlsx");
};

// Function to fetch notifications
const fetchNotifications = async () => {
  try {
    const userId = localStorage.getItem("userId") || "";
    if (!userId) throw new Error("User not logged in");
    const response = await axiosInstance.get(`/notifications/${userId}`); // Assuming this endpoint fetches notifications
    setNotifications(response.data); // Set notifications in the state
  } catch (error) {
    console.error("Error fetching notifications:", error);
    setErrorMessage("Failed to fetch notifications.");
  }
};

useEffect(() => {
  fetchManagerExpenseReport();
  fetchNotifications(); // Fetch notifications when the component mounts
}, []);

  return (
    <div className="container mt-4">
      <nav className="navbar d-flex justify-content-between align-items-center">
        <h1>Manager Dashboard</h1>
        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
          {/* Notification Bell */}
          <NotificationDropdown notifications={notifications} />
          {/* Profile Icon */}
          <ProfileDropdown />
        </div>
      </nav>

      {/* Buttons for View Report and Download Report */}
      <div className="d-flex justify-content-between align-items-center mt-3" style={{ gap: "10px" }}>
        <Button variant="primary" className="btn flex-fill text-center" onClick={() => { fetchManagerExpenseReport(); setShowReportModal(true); }} disabled={reportLoading}>
        {reportLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "View Report"
          )}
        </Button>
        <Button variant="danger" className="flex-fill text-center" onClick={downloadPDFReport} disabled={reportLoading}>
        {reportLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Download PDF Report"
          )}
        </Button>
        <Button variant="success" className="btn flex-fill text-center" onClick={downloadCSVReport} disabled={reportLoading}>
          
          {reportLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Download CSV Report"
          )}
        </Button>
      </div>

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}

      {/* Pending Claims Table */}
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
                <Button variant="success" className="m-2" onClick={() => handleApprove(claim.id)} disabled={loadingClaims[`approve_${claim.id}`]}>
                {loadingClaims[`approve_${claim.id}`] ? <Spinner animation="border" size="sm" /> : "Approve"}
                </Button>
                <Button variant="danger" className="m-2" onClick={() => handleReject(claim.id)} disabled={loadingClaims[`reject_${claim.id}`]}>
                {loadingClaims[`reject_${claim.id}`] ? <Spinner animation="border" size="sm" /> : "Reject"}
                </Button>
                <Button
                  variant="info"
                  className="m-2"
                  onClick={() => {
                    setExpenseIdForRequest(claim.id);
                    setShowInfoModal(true); // Show the modal when "Request Info" is clicked
                  }}
                >
                  Request Info
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Viewing Report */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manager's Expense Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {reportLoading ? (
          <Spinner animation="border" />
          ) : (
            <Table striped bordered hover>
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.userId}</td>
                  <td>{expense.amount}</td>
                  <td style={{ 
                    color: {
                      Pending: "orange",
                      Rejected: "red",
                      Approved: "green",
                    }[expense.status] || "black",
                  }}
                >{expense.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>

      {/* Modal for entering requested information */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
        <Modal.Header closeButton={!loadingClaims[`submit_${expenseIdForRequest}`]}>
          <Modal.Title>Request Additional Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Enter the additional information requested"
            value={requestedInfo}
            onChange={(e) => setRequestedInfo(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowInfoModal(false)} 
            disabled={loadingClaims[`submit_${expenseIdForRequest}`]}
            style={
              loadingClaims[`submit_${expenseIdForRequest}`]
                ? { opacity: 0.5, pointerEvents: "none" }
                : {}
            }
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={() => handleRequestInfo(expenseIdForRequest, requestedInfo)} disabled={loadingClaims[`submit_${expenseIdForRequest}`]}
          >
            {loadingClaims[`submit_${expenseIdForRequest}`] ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;