const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'saifnemri2k21@gmail.com', // Replace with your email to test
  subject: 'Test Password Reset Code',
  text: 'This is a test email for password reset code from StonkMarket.'
};

console.log('Sending test reset email with the following options:', mailOptions); // Add logging

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
