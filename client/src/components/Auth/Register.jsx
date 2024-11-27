import React, { useState, useEffect } from "react";
import '../styles/register.css';
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const navigate = useNavigate();

    // useEffect(() => {
    //     // Set the `createdBy` field programmatically
    //     const loggedInUser = localStorage.getItem("username") || "admin";
    //     setFormData((prevData) => ({ ...prevData, createdBy: loggedInUser }));
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axiosInstance.post("/auth/register", formData);
            const data = response.data;

            if (response.status === 201) {
                alert(data.message);

                // Redirect based on role
                if (data.role === "employee") {
                    navigate("/dashboard/employee");
                } else if (data.role === "manager") {
                    navigate("/dashboard/manager");
                } else if (data.role === "finance") {
                    navigate("/dashboard/finance");
                } else {
                    navigate("/"); // Default redirect
                }
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-page">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Choose a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
};

export default Register;
