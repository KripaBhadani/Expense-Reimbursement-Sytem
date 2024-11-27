// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// const fs = require("fs");
// const { Parser } = require("json2csv"); // For report generation


const { sequelize } = require("./models"); // Import models and Sequelize instance
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const { authenticateJWT } = require("./middleware/authMiddleware"); // Middleware for JWT authentication
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); // Update origin as needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/dashboard", dashboardRoutes);

// app.use(expenseRoutes);

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/claims", authenticateJWT, expenseRoutes); // Modularized expense routes with JWT authentication

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
});

// Database synchronization
sequelize
    .sync({ logging: false })
    .then(() => console.log("Database connected and models synced"))
    .catch((err) => console.error("DB connection error:", err));

module.exports = app;


// // Fetch Claims
// app.get("/api/claims", authenticateToken, async (req, res) => {
//     try {
//         const claims = await Expense.findAll({ where: { userId: req.user.id } });
//         res.json({ claims });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch claims" });
//     }
// });

// // Download Report
// app.get("/api/claims/report", authenticateToken, async (req, res) => {
//     try {
//         const claims = await Expense.findAll({ where: { userId: req.user.id }, raw: true });
//         if (claims.length === 0) return res.status(404).json({ error: "No claims to generate report" });

//         const json2csv = new Parser();
//         const csv = json2csv.parse(claims);

//         const filePath = `./reports/claims_report_${req.user.id}.csv`;
//         fs.writeFileSync(filePath, csv);

//         res.download(filePath, (err) => {
//             if (err) console.error("File download error:", err);
//             fs.unlinkSync(filePath); // Clean up after download
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to generate report" });
//     }
// });

// // Submit Expense
// app.post("/api/expenses", authenticateToken, async (req, res) => {
//     const { amount, description, receiptUrl } = req.body;

//     try {
//         const expense = await Expense.create({
//             userId: req.user.id,
//             amount,
//             description,
//             receiptUrl,
//         });
//         res.status(201).json({ expense });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to submit expense" });
//     }
// });

// // Approve/Reject Expense
// app.put("/api/expenses/:id", async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;

//     try {
//         const updatedRows = await Expense.update({ status }, { where: { id } });
//         if (updatedRows[0] === 0) return res.status(404).json({ error: "Expense not found" });

//         res.json({ message: "Expense status updated successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to update expense status" });
//     }
// });

// // Request Additional Information
// app.put("/api/expenses/:id/request-info", authenticateToken, async (req, res) => {
//     const { id } = req.params;
//     const { requestedInfo } = req.body;

//     try {
//         const updatedRows = await Expense.update({ requestedInfo }, { where: { id } });
//         if (updatedRows[0] === 0) return res.status(404).json({ error: "Expense not found" });

//         res.json({ message: "Requested additional information successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to request additional info" });
//     }
// });
