const sendEmail = require("./utils/email");

sendEmail("kripabhadani29@gmail.com", "Test Subject", "<p>This is a test email</p>")
    .then(() => console.log("Email sent successfully!"))
    .catch((error) => console.error("Error sending email:", error));
