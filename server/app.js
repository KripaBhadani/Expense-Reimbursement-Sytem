// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// const fs = require("fs");
// const { Parser } = require("json2csv"); // For report generation


const { sequelize } = require("./models"); // Import models and Sequelize instance
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); // Update origin as needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/claims", claimRoutes); // Modularized expense routes with JWT authentication
app.use("/api/dashboard", dashboardRoutes);
// app.use(expenseRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
});

// Database synchronization
sequelize
    .sync({ logging: false, force: false })
    .then(() => console.log("Database connected and models synced"))
    .catch((err) => console.error("DB connection error:", err));

module.exports = app;


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
