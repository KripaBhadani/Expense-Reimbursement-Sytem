import React, { useState } from "react";
import { Dropdown, Badge, ListGroup, Button } from "react-bootstrap";
import { FaBell } from "react-icons/fa"; // Bell icon

const NotificationDropdown = ({ notifications }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Dropdown
      show={showDropdown}
      onToggle={() => setShowDropdown((prev) => !prev)}
      align="end"
    >
      {/* Notification Icon with Badge */}
      <Dropdown.Toggle
        as={Button}
        variant="light"
        style={{
          position: "relative",
          padding: "8px",
          border: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "50%",
          backgroundColor: "#fff",
        }}
      >
        <FaBell size={20} style={{ color: "#555" }} />
        {notifications.length > 0 && (
          <Badge
            pill
            bg="danger"
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              fontSize: "10px",
            }}
          >
            {notifications.length}
          </Badge>
        )}
      </Dropdown.Toggle>

      {/* Dropdown Menu */}
      <Dropdown.Menu
        style={{
          minWidth: "300px",
          border: "none",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 15px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Notifications
        </div>
        <ListGroup variant="flush">
          {notifications.length === 0 ? (
            <ListGroup.Item style={{ textAlign: "center", color: "#555" }}>
              No notifications
            </ListGroup.Item>
          ) : (
            notifications.slice(0, 5).map((notification, index) => (
              <ListGroup.Item
                key={index}
                style={{
                  fontSize: "14px",
                  padding: "10px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f7f7f7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {notification.message}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
        {notifications.length > 5 && (
          <Dropdown.Item
            href="/notifications"
            style={{
              textAlign: "center",
              padding: "10px",
              color: "#007BFF",
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: "#f7f7f7",
              borderTop: "1px solid #ddd",
            }}
          >
            View All Notifications
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
