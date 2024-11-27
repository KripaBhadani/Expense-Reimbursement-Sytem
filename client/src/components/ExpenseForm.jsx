import React, { useState } from "react";
import axios from "axios";

const ExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Constants for file validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // Predefined categories
  const categories = ['Travel', 'Meals', 'Accommodation', 'Supplies', 'Office', 'Training', 'Entertainment', 'Technology', 'Medical', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage(""); // Reset message on form submit

    // Client-side validation
    if (!amount || parseFloat(amount) <= 0) {
      alert("Amount must be greater than zero.");
      setLoading(false);
      return;
    }

    if (!category) {
      alert("Category is required.");
      setLoading(false);
      return;
    }

    if (receipt && receipt.size > MAX_FILE_SIZE) {
      alert("File size must not exceed 5 MB.");
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      alert("Description is required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("amount", parseFloat(amount));
      formData.append("category", category);
      if (receipt) formData.append("receipt", receipt);

      // Log FormData to the console to check its structure
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); // Logs key-value pairs of FormData
      }

      const token = localStorage.getItem("token"); // Fetch token from local storage
      console.log("Token: ", token);
      
      const response = await axios.post("http://localhost:5000/api/claims/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      // On successful submission
      alert("Expense claim submitted successfully!");
      setMessage("Expense claim submitted successfully!");
      setDescription("");
      setAmount("");
      setCategory("");
      setReceipt(null);
      setTimeout(() => window.location.href = "/dashboard/employee", 100); // Redirect to dashboard

    } catch (error) {
      console.error("Error submitting claim:", error.response?.data || error.message);
      // User-friendly error messages
      if (error.response?.status === 400) {
        setMessage("Invalid input. Please check your data.");
      } else if (error.response?.status === 413) {
        setMessage("File size too large. Please upload a smaller file.");
      } else if (error.response?.status === 500) {
        setMessage("Server error. Please try again later.");
      } else {
        setMessage("Failed to submit claim. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Submit New Expense Claim</h2>
        {message && (
          <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              rows="3"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter the expense amount"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="receipt" className="form-label">
              Receipt (Optional)
            </label>
            <input
              type="file"
              id="receipt"
              className="form-control"
              onChange={(e) => setReceipt(e.target.files[0])}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
