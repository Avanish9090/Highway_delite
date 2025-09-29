const nodemailer = require('nodemailer');
require('dotenv').config();

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendOtpMiddleware = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!otp) {
    const generatedOtp = generateOTP();
    otpStore.set(email, generatedOtp);

    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey', // This is not your SendGrid email
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL, // Must be a verified sender
      to: email,
      subject: 'Highway delite authentication',
      text: `Your OTP is: ${generatedOtp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
  }

  const validOtp = otpStore.get(email);
  if (otp == validOtp) {
    otpStore.delete(email);
    return next();
  } else {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }
};

module.exports = sendOtpMiddleware;
