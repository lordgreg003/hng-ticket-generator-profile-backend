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
    subject: "Your Ticket Is Booked",
    text: `Hello ${name}, You booked a ticket for techember fest '25 at 04-Rumens road ,Ikoyi,Lagos `,
    date: "March 15,2025|7:00 PM",
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
