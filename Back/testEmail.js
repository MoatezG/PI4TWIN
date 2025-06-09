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
  subject: 'Test Email',
  text: 'This is a test email from StonkMarket.'
};

console.log('Sending test email with the following options:', mailOptions); // Add logging

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
    if (error.responseCode === 535) {
      console.error('Invalid login credentials. Please check your username and password.');
    }
  } else {
    console.log('Email sent:', info.response);
  }
});
