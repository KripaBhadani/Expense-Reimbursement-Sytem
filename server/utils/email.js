const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail", // Use "gmail" or your email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }

    return transporter.sendMail(mailOptions);
};

const sendGenericEmail = async (to, subject, message, managerEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Generic email account
        to, // Recipient's email
        subject, // Email subject
        text: `This email is sent on behalf of (${managerEmail}):\n\n${message}`,
        replyTo: managerEmail,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Generic email sent successfully");
    } catch (error) {
        console.error("Error sending generic email:", error);
    }
};


module.exports = { sendEmail, sendGenericEmail };
