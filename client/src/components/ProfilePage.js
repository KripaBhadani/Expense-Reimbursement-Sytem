import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in");

        const response = await axiosInstance.get(`/user-profile/${userId}`);
        setUser(response.data);
        setErrorMessage(""); // Clear previous errors
      } catch (error) {
        console.error("Error fetching data: ", error.response?.data?.message || error.message);
        setErrorMessage(error.response?.data?.message || "Failed to load user data.");
      }
    };

    fetchProfile();
  }, []);

  // Handle form submission to save data
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");

      const response = await axiosInstance.put(`/user-profile/${userId}`, user);
      setUser(response.data);
      setSuccessMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile: ", error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Profile Details
      </h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!user ? (
        <p>Loading...</p>
      ) : editMode ? (
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div>
            <label style={{ fontWeight: "bold" }}>Name:</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: "bold" }}>Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: "bold" }}>Role:</label>
            <input
              type="text"
              value={user.role}
              disabled
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
