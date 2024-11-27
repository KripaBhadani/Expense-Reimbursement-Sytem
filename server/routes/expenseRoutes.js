const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const db = require("../config/db"); // Ensure your DB connection is imported
const { submitClaim } = require("../controllers/expenseController");

// Submit a new expense
router.post("/api/expenses", async (req, res) => {
    const { userId, amount, description, receiptUrl } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO Expenses (userId, amount, description, receiptUrl) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, amount, description, receiptUrl]
        );
        res.status(201).json({ expense: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit expense" });
    }
});

// Approve or Reject an Expense
router.put("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await db.query(
            "UPDATE Expenses SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        res.json({ expense: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update expense status" });
    }
});

// Request additional details for an expense
router.put("/api/expenses/:id/request-info", async (req, res) => {
    const { id } = req.params;
    const { requestedInfo } = req.body;

    try {
        const result = await db.query(
            "UPDATE Expenses SET requestedInfo = $1 WHERE id = $2 RETURNING *",
            [requestedInfo, id]
        );
        res.json({ expense: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to request additional info" });
    }
});


module.exports = router;
