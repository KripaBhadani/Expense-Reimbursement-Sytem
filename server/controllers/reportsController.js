// controllers/reportsController.js
const db = require("../config/db");
const { Expense, User, Approval, Notification } = require("../models");
const { Parser } = require("json2csv");
const fs = require("fs");


const getEmployeeExpenseSummary = async (req, res) => {
    const userId = req.user.id;
    console.log("Employee Expense Summary API hit", req.user);


    try {
        // Fetch all expenses for the given userId from the database
        const expenses = await Expense.findAll({
            where: { userId },
            include: [
                { model: User, attributes: ['id', 'username'] },  // If you want to include user data
                { model: Approval, attributes: ['id', 'status', 'approvedAt'] },
                { model: Notification, attributes: ['id', 'message', 'createdAt'] }
            ]
    });
    // console.log("Fetched Employee Expenses:", result);

    if (!expenses || expenses.length === 0) {
        return res.status(404).json({ message: "No expenses found for this user" });
    }

    // Transform data to include only necessary fields
    const formattedExpenses = expenses.map((expense) => ({
        id: expense.id,
        userId: expense.User?.username || "Unknown User",
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        status: expense.status,
        submittedAt: expense.createdAt, // Format this in frontend
        approvals: expense.Approvals.map((approval) => ({
            id: approval.id,
            status: approval.status,
            approvedAt: approval.approvedAt
        })),
        notifications: expense.Notifications.map((notification) => ({
            id: notification.id,
            message: notification.message,
            createdAt: notification.createdAt
        }))
    }));
        // Send the result as a JSON response
        res.json(formattedExpenses);
    } catch (error) {
        console.error("Error fetching employee expenses:", error);
        res.status(500).json({ error: error.message || "Failed to fetch report" });
    }
};

const getManagerExpenseOverview = async (req, res) => {
    try {
        console.log("Manager Expense Overview API hit", req.user);

        // Fetch expenses with status 'Approved' or 'Rejected' using Sequelize ORM
        const expenses = await Expense.findAll({
            where: {
                status: ['Approved', 'Rejected']
            },
            include: [
                { model: User, attributes: ['id', 'username'] },  // Including user data
                { model: Approval, attributes: ['id', 'status', 'approvedAt'] },  // Including approvals related to the expense
                { model: Notification, attributes: ['id', 'message', 'createdAt'] }  // Including notifications related to the expense
            ]
        });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found for this user" });
        }

        // Transform data
        const formattedExpenses = expenses.map((expense) => ({
            id: expense.id,
            userId: expense.User?.username || "Unknown User",
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            status: expense.status,
            submittedAt: expense.createdAt, // Format in frontend
            approvals: expense.Approvals.map((approval) => ({
                id: approval.id,
                status: approval.status,
                approvedAt: approval.approvedAt
            })),
            notifications: expense.Notifications.map((notification) => ({
                id: notification.id,
                message: notification.message,
                createdAt: notification.createdAt
            }))
        }));
        // Send the result as a JSON response
        res.json(formattedExpenses);
    } catch (error) {
        console.error("Error fetching manager expenses:", error);
        res.status(500).json({ error: error.message || "Failed to fetch report" });
    }
};

const downloadReport = async (req, res) => {
    try {
        // Fetch all claims for the authenticated user
        const claims = await Expense.findAll({ where: { userId: req.user.id }, raw: true });
        
        // If no claims exist, return an error
        if (claims.length === 0) return res.status(404).json({ error: "No claims to generate report" });

        // Convert claims data to CSV format using json2csv
        const json2csv = new Parser();
        const csv = json2csv.parse(claims);

        // Create a temporary file path for the CSV report
        const filePath = `./reports/claims_report_${req.user.id}.csv`;

        // Write the CSV data to the file
        fs.writeFileSync(filePath, csv);

        // Send the file to the user as a download
        res.download(filePath, (err) => {
            if (err) {
                console.error("File download error:", err);
            }
            // Clean up the temporary file after sending
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate report" });
    }
};

module.exports = {
    getEmployeeExpenseSummary,
    getManagerExpenseOverview,
    downloadReport
};
