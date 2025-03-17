const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to send verification email
app.post("/send-verification-email", async (req, res) => {
  const { email, name } = req.body;

  // Validate request body
  if (!email || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Email and name are required." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Delve - Subscription Confirmed!",
    text: `Dear ${name}, 

Thank you for subscribing to Delve! We're excited to have you on board. 

Stay tuned for exclusive insights, updates, and curated content delivered straight to your inbox.

If you have any questions or need assistance, feel free to reach out.

Best regards,  
The Delve Team  

📅 Subscription Date: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.json({
      success: true,
      message: "Verification email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email.",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
