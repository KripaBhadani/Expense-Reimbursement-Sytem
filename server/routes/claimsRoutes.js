const express = require("express");
const { Expense } = require('../models');
const { User } = require('../models');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const { sendEmail, sendGenericEmail } = require("../utils/email");


const router = express.Router();

// Employee Dashboard: Fetch submitted claims
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from JWT token
        const claims = await Expense.findAll({
            where: { userId }, // Filter by userId to get only the employee's claims
            attributes: ['id', 'amount', 'description', 'status'],
        });
        res.json({ claims });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
    }
});

// to fetch pending claims by managers
router.get('/pending', authenticateJWT, async (req, res) => {
    try {
        const claims = await Expense.findAll({
            where: { status: 'Pending' }, // Fetch only pending claims
        });
        res.json({ claims });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch pending claims', error: error.message });
    }
});

// to view approved claims by finance
router.get('/approved', authenticateJWT, async (req, res) => {
    try {
        const claims = await Expense.findAll({
            where: { status: 'Approved' }, // Fetch only approved claims
        });
        res.json({ claims });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch approved claims', error: error.message });
    }
});

// Submit a new claim
router.post(
    "/submit",
    authenticateJWT,
    upload.single('receipt'),
    [
        body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than zero.").toFloat(),
        body("description").notEmpty().withMessage("Description is required."),
        body("category").isIn(['Travel', 'Meals', 'Accommodation', 'Supplies', 'Office', 'Training', 'Entertainment', 'Technology', 'Medical', 'Other']).withMessage("Invalid category."),

    ],
    async (req, res) => {
        console.log('Form Data:', req.body);
        console.log('Uploaded File:', req.file);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation Errors:", errors.array()); // Debug validation errors
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Receipt file is required.' });
        }
        

        const { amount, description, category } = req.body; // Form data
        const receiptUrl = req.file ? req.file.path : null; // Uploaded file

        console.log("Parsed Data:", { amount, description, category, receiptUrl });


        try {
            const newClaim = await Expense.create({
                userId: req.user.id, // Extracted from JWT
                amount: parseFloat(amount),
                description,
                category,
                receipt: receiptUrl, // Optional: Uploaded file path
                status: "Pending", // Default status for a new claim
            });

            // Send email notification
            const subject = "Claim Submitted";
            const message = `Your claim for ₹${amount} has been successfully submitted.`;
            console.log("req.user:", req.user);

            console.log("Sending Email to: ", req.user.email);
            await sendEmail(req.user.email, subject, message);

            res.status(201).json({ message: "Claim submitted successfully", newClaim });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to submit claim", error: error.message });
        }
    });

// Update claim status (Approve/Reject)
router.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params; // Claim ID
    const { status } = req.body; // New status: "approved" or "rejected"
    const validStatuses = ["Approved", "Rejected"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        // Update the status of the claim
        const claim = await Expense.findOne({
            where: { id },
            include: [{ model: User, as: 'User', attributes: ['email', 'id'] }],
        })

        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        const updatedClaim = await Expense.update(
            { status }, // Update this field
            { where: { id }, returning: true } // Filter by claim ID
        );

        // Update the claim status
        claim.status = status;
        await claim.save();

        const employeeEmail = claim.User.email; // Employee email
        const managerEmail = req.user.email; // Manager email (from JWT)

        const subject = `Claim ${status}`;
        const employeeMessage =
            status === "Approved"
                ? `Your claim with ID ${id} has been approved.`
                : `Your claim with ID ${id} has been rejected.`;
        const managerMessage = `You have ${status.toLowerCase()} the claim with ID ${id} submitted by user ID ${claim.User.id}.`;

         // Send email to both employee and manager
         await sendGenericEmail(employeeEmail, subject, employeeMessage, managerEmail); // Email to employee
         await sendEmail(managerEmail, subject, managerMessage); // Email to manager

        // Respond with the updated claim
        res.json({ message: `Claim ${status.toLowerCase()} successfully`, claim });
    } catch (error) {
        console.error("Error updating claim status:", error);
        res.status(500).json({ error: "Failed to update claim status" });
    }
});

// To request additonal information
router.put('/:id/request-info', authenticateJWT, async (req, res) => {
    const { id } = req.params; // Get the claim ID from the URL
    const { requestedInfo } = req.body; // Get the requested additional information from the body

    try {
        // Find the claim and include the associated user (employee) details
        const claim = await Expense.findOne({
            where: { id },
            include: [{ model: User, as: 'User', attributes: ['email', 'id'] }],
        });

        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        // Update the requestedInfo field
        claim.requestedInfo = requestedInfo;
        await claim.save();

        const employeeEmail = claim.User.email; // Employee email
        const managerEmail = req.user.email; // Manager email (from JWT)

        // Send email notifications
        const subject = "Additional Information Required";
        const employeeMessage = `Additional information is required for your claim with ID ${id}: ${requestedInfo}`;
        const managerMessage = `You have requested additional information for claim ID ${id} submitted by user ID ${claim.User.id}.`;

        // Send email to both employee and manager
        await sendGenericEmail(employeeEmail, subject, employeeMessage, managerEmail); // Email to employee
        await sendEmail(managerEmail, subject, managerMessage); // Email to manager

        res.json({message: "Additional information requested successfully", claim,});
    } catch (error) {
        console.error("Error requesting additional information:", error);
        res.status(500).json({ error: "Failed to request additional information" });
    }
});

module.exports = router;