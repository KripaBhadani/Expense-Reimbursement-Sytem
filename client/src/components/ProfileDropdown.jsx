import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Handle click outside to close the menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".profile-dropdown") && !event.target.closest(".profile-icon")) {
        setShowProfileMenu(false); // Close menu if clicked outside
      }
    };

    if (showProfileMenu) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showProfileMenu]);

  return (
    <div style={{ position: "relative" }}>
      {/* Profile Icon */}
      <FaUserCircle
        size={40}
        className="profile-icon"
        style={{
          cursor: "pointer",
          color: "#555",
          transition: "color 0.3s ease",
        }}
        onClick={() => setShowProfileMenu((prev) => !prev)} // Toggle menu on click
        onMouseEnter={(e) => (e.currentTarget.style.color = "#007BFF")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
      />
  
      {/* Profile Menu */}
      {showProfileMenu && (
        <div
          className="profile-dropdown"
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            width: "250px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div style={{ marginBottom: "15px", textAlign: "center" }}>
            <FaUserCircle size={50} style={{ color: "#007BFF" }} />
            <h3 style={{ margin: "10px 0 5px", fontSize: "18px", color: "#333" }}>
              {localStorage.getItem("name") || "Not available"}
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>
              {localStorage.getItem("role") || "Not available"}
            </p>
          </div>
          <hr style={{ margin: "10px 0", borderColor: "#eee" }} />
          <div style={{ fontSize: "14px", color: "#555", lineHeight: "1.8" }}>
            <p>Email: <span style={{ color: "#333" }}>{localStorage.getItem("email") || "Not available"}</span></p>
            <p>ID: <span style={{ color: "#333" }}>{localStorage.getItem("userId") || "Not available"}</span></p>
          </div>
          <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
            <button
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                color: "white",
                backgroundColor: "#007BFF",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
              onClick={() => navigate("/user-profile")}
            >
              Edit Profile
            </button>
            <button
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                color: "white",
                backgroundColor: "#FF4D4D",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#CC0000")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF4D4D")}
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
