const express = require("express");
const router = express.Router();

// Endpoint to fetch employee's submitted claims
router.get("/", (req, res) => {
    const userId = req.user.id; // Extracted from JWT token (replace with actual logic)
    
    // Simulate fetching claims from database (replace with actual DB call)
    const employeeClaims = [
        { id: 1, description: "Travel Expense", status: "Submitted", amount: 100 },
        { id: 2, description: "Meal Expense", status: "Approved", amount: 50 },
    ];
    
    res.json({ claims: employeeClaims });
});

// Endpoint to fetch pending claims for the manager
router.get("/pending", (req, res) => {
    // Simulate fetching pending claims for manager (replace with actual DB call)
    const pendingClaims = [
        { id: 3, description: "Hotel Expense", status: "Pending", amount: 500 },
        { id: 4, description: "Flight Expense", status: "Pending", amount: 40 },
    ];

    res.json({ claims: pendingClaims });
});

// Endpoint to fetch approved claims for finance processing
router.get("/approved", (req, res) => {
    // Simulate fetching approved claims for finance (replace with actual DB call)
    const approvedClaims = [
        { id: 2, description: "Meal Expense", status: "Approved", amount: 50 },
        { id: 5, description: "Taxi Fare", status: "Approved", amount: 300 },
    ];

    res.json({ claims: approvedClaims });
});

module.exports = router;
