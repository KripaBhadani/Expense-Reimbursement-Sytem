// routes/reports.js
const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const { authenticateJWT } = require('../middleware/authMiddleware');
// Route for Employee Expense Summary
router.get("/employee/:userId", authenticateJWT, reportsController.getEmployeeExpenseSummary);

// Route for Manager Expense Overview
router.get("/manager", reportsController.getManagerExpenseOverview);

// Download Report Route (Server-side)
router.get("/download", authenticateJWT, reportsController.downloadReport);


module.exports = router;
