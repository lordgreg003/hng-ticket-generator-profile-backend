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
    html: `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <img src="https://res.cloudinary.com/dg8cmo2gb/image/upload/v1742306799/SUBSCRIPTION_MAIL_ou4oqt.jpg" 
           alt="Subscription Confirmation" 
           style="max-width: 100%; height: auto;">
      <h2>Dear ${name},</h2>
      <p>Thank you for subscribing to <strong>Delve</strong>! We're excited to have you on board.</p>
      <p>Stay tuned for exclusive insights, updates, and curated content delivered straight to your inbox.</p>
      <p>If you have any questions or need assistance, feel free to reach out.</p>
      <br>
      <p><strong>Best regards,</strong><br> The Delve Team</p>
      <p>📅 Subscription Date: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</p>
    </div>
  `,
    attachments: [
      {
        filename: "subscription.jpg",
        path: "https://res.cloudinary.com/dg8cmo2gb/image/upload/v1742306799/SUBSCRIPTION_MAIL_ou4oqt.jpg",
      },
    ],
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

// New endpoint to send a message
app.post("/send-message", async (req, res) => {
  const { email, name, message } = req.body;

  // Validate request body
  if (!email || !name || !message) {
    return res.status(400).json({
      success: false,
      message: "Email, name, and message are required.",
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Message Received",
    html: `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <h2>Dear ${name},</h2>
      <p>Thank you for reaching out to us! We have received your message and will get back to you shortly.</p>
      <p>Here is the message you sent:</p>
      <p><strong>${message}</strong></p>
      <br>
      <p><strong>Best regards,</strong><br> The Delve Team</p>
      <p>📅 Message Received Date: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Message email sent successfully!");
    res.json({
      success: true,
      message: "Message email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending message email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message email.",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
