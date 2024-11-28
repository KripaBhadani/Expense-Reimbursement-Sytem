import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Spinner, Modal } from "react-bootstrap";
import NotificationDropdown from "../../components/NotificationDropdown";
import axiosInstance from "../../utils/axiosInstance";
import { format } from "date-fns";
import '../styles/Dashboard.css';
import ProfileDropdown from "../ProfileDropdown";

const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState(null);
  // const history = useHistory();
  
  // Fetch claims and notifications from the server
  useEffect(() => {
    // console.log("Updated Notifications:", notifications);
    const fetchData = async () => {
      setLoading(true);
      try {
        const claimsResponse = await axiosInstance.get("/claims");
        const userId = localStorage.getItem("userId") || "";
        if (!userId) throw new Error("User not logged in");
        
        const notificationsResponse = await axiosInstance.get(`/notifications/${userId}`);
        // console.log("Notifications Response:", notificationsResponse.data);
        setClaims(claimsResponse.data.claims.map(claim => ({
          ...claim,
          submittedAt: formatDate(claim.submittedAt),
        })));
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // const handleEditProfile = () => {
  //   history.push("/profile");
  // };

  
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "Invalid Date" : format(parsedDate, "dd MMM yyyy, HH:mm");
  };

  // Download report
  const downloadReport = async () => {
    setReportLoading(true);
    try {
      const response = await axiosInstance.get("/reports/download", {
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

  // View Detailed report (open in a modal or new tab)
  const viewReport = async () => {
    setReportLoading(true);
    try {
      const userId = localStorage.getItem("userId") || "";

      const response = await axiosInstance.get(`/reports/employee/${userId}`);
      const formattedData = response.data?.map((expense) => ({
        ...expense,
        formattedDate: formatDate(expense.submittedAt),
      })) || [];

      setReportContent(formattedData);
      setShowReportModal(true);

    } catch (error) {
      console.error("Error fetching report:", error.response?.data?.message || error.message);
    } finally {
      setReportLoading(false);
    }
  };

  
  

  return (
    <div className="container mt-4">
      <nav className="navbar d-flex justify-content-between align-items-center">
        <h1>Employee Dashboard</h1>
        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
          {/* Notification Bell */}
          <NotificationDropdown notifications={notifications} />
          {/* Profile Icon */}
          <ProfileDropdown />
        </div>
      </nav>

      <div className="d-flex justify-content-between align-items-center mt-3" style={{ gap: "10px" }}>
        <Link to="/submit-claim" className="btn btn-primary flex-fill text-center">
          Submit New Claim
        </Link>

        {/* View Report Button */}
        <Button 
          variant="info" 
          className="btn flex-fill text-center"
          onClick={viewReport} 
          disabled={reportLoading || claims.length === 0} 
        >
          {reportLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "View Report"
          )}
        </Button>

        {/* Download Report button */}
        <Button 
          variant="secondary"
          className="flex-fill text-center"
          onClick={downloadReport} 
          disabled={reportLoading || claims.length === 0}
        >
          {reportLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Download Report"
          )}
        </Button>
      </div>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      {/* Submitted Claims Section */}
      <h3 className="mt-4">Submitted Claims</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : claims?.length > 0 ? (
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
                <td style={{ color: {
                  Pending: "orange",
                  Rejected: "red",
                  Approved: "green",
                }[claim.status] || "black", }}>
                  {claim.status}
                </td>
                <td>${claim.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No claims submitted yet.</p>
      )}

      {/* Modal for Viewing Report */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Expense Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportContent && reportContent.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Notifications</th>
                </tr>
              </thead>
              <tbody>
                {reportContent.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.id}</td>
                    <td>{expense.userId}</td>
                    <td>₹{expense.amount}</td>
                    <td>{expense.category}</td>
                    <td style={{ color: expense.status === "Pending" ? "orange" : "green" }}>
                        {expense.status}
                    </td>
                    <td>{expense.formattedDate}</td>
                    <td>{expense.notifications.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No report data available.</p>
          )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Close
            </Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
