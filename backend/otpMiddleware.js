// otpMiddleware.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const otpStore = new Map(); // In-memory store (email => OTP), use Redis/DB in production

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP middleware
const sendOtpMiddleware = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // If OTP is not provided, generate & send
  if (!otp) {
    const generatedOtp = generateOTP();
    otpStore.set(email, generatedOtp);

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS,
          },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Highway delite authentication',
      text: `Your OTP is: ${generatedOtp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
  }

  // If OTP is provided, verify it
  const validOtp = otpStore.get(email);
  if (otp == validOtp) {
    otpStore.delete(email); // One-time use
    return next();
  } else {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }
};

module.exports = sendOtpMiddleware;
