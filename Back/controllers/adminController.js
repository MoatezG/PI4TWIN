const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendResetCodeEmail, generateResetCode } = require('../utils/emailUtils');

const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send({ error: 'Passwords do not match' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const admin = new Admin({ fullname, email, password: hashedPassword, verified: false });
    await admin.save();
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    sendVerificationEmail(admin, token);
    res.status(201).send({ message: 'Admin created successfully. Please check your email to verify your account.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ error: 'fullname or email already exists' });
    }
    res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const admin = await Admin.findOne({ $or: [{ email: identifier }, { fullname: identifier }] });
    if (!admin) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    if (!admin.verified) {
      return res.status(400).send({ error: 'Please verify your email before logging in.' });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ 
      message: 'Login successful', 
      token, 
      admin: { 
        id: admin._id, 
        fullname: admin.fullname, 
        email: admin.email, 
        verified: admin.verified 
      } 
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send({ error: 'Email not found' });
    }
    const resetCode = generateResetCode();
    admin.resetCode = resetCode;
    await admin.save();
    sendResetCodeEmail(admin, resetCode);
    res.send({ message: 'Password reset code sent' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;
  try {
    const admin = await Admin.findOne({ email, resetCode });
    if (!admin) {
      return res.status(400).send({ error: 'Invalid reset code' });
    }
    res.send({ message: 'Reset code verified' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(400).send({ error: 'Passwords do not match' });
  }
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send({ error: 'Invalid email' });
    }
    admin.password = await bcrypt.hash(newPassword, 8);
    admin.resetCode = null;
    await admin.save();
    res.send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(400).send({ error: 'Invalid token' });
    }
    admin.verified = true;
    await admin.save();
    res.send({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password -resetCode');
    if (!admin) {
      return res.status(404).send({ error: 'Admin not found' });
    }
    res.send(admin);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { fullname, email } = req.body;
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, { fullname, email }, { new: true });
    if (!admin) {
      return res.status(404).send({ error: 'Admin not found' });
    }
    res.send(admin);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const adminId = req.user.id;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin || !await bcrypt.compare(oldPassword, admin.password)) {
      return res.status(400).send({ error: 'Invalid old password' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ error: 'Passwords do not match' });
    }
    admin.password = await bcrypt.hash(newPassword, 8);
    await admin.save();
    res.send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  verifyEmail,
  getAdminById,
  updateProfile,
  changePassword
};
