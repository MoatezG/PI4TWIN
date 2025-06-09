const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = (user, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    html: `
      <h1>Welcome to SustainaFood</h1>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

const sendResetCodeEmail = (user, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Your Password Reset Code',
    html: `
      <h1>Password Reset Request</h1>
      <p>Your password reset code is:</p>
      <p style="font-size: 24px; font-weight: bold;">${resetCode}</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset code email:', error);
    } else {
      console.log('Reset code email sent:', info.response);
    }
  });
};

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  sendVerificationEmail,
  sendResetCodeEmail,
  generateResetCode
};