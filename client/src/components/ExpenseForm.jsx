import React, { useState } from "react";
import axios from "axios";
import './styles/expenseForm.css';

const ExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const categories = ['Travel', 'Meals', 'Accommodation', 'Supplies', 'Office', 'Training', 'Entertainment', 'Technology', 'Medical', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Reset message on form submit

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

      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/claims/submit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Expense claim submitted successfully!");
      setMessage("Expense claim submitted successfully!");
      setDescription("");
      setAmount("");
      setCategory("");
      setReceipt(null);
      setTimeout(() => window.location.href = "/dashboard/employee", 100);

    } catch (error) {
      console.error("Error submitting claim:", error.response?.data || error.message);
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
    <div className="expense-form-container">
      <div className="card">
        <h2 className="form-title">Submit New Expense Claim</h2>
        {message && (
          <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
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

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="receipt">Receipt (Optional)</label>
            <input
              type="file"
              id="receipt"
              className="form-control-file"
              onChange={(e) => setReceipt(e.target.files[0])}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
