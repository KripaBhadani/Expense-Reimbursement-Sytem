import React, { useState } from "react";
import axios from "axios";

const ExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("amount", amount);
      if (receipt) formData.append("receipt", receipt);

      const token = localStorage.getItem("token"); // Fetch token from local storage
      await axios.post("http://localhost:5000/api/claims", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Expense claim submitted successfully!");
      setDescription("");
      setAmount("");
      setReceipt(null);
    } catch (error) {
      console.error("Error submitting claim:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Submit New Expense Claim</h2>
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
