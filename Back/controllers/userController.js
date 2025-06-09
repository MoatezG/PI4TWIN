const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendResetCodeEmail, generateResetCode } = require('../utils/emailUtils');
require('dotenv').config();
const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword, role } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send({ error: 'Passwords do not match' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ fullname, email, password: hashedPassword, verified: false, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    sendVerificationEmail(user, token);
    res.status(201).send({ message: 'User created successfully. Please check your email to verify your account.' });
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
    const user = await User.findOne({ $or: [{ email: identifier }, { fullname: identifier }] });
    if (!user) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isGoogleIdValid = password === user.googleId;
    if (!isPasswordValid && !isGoogleIdValid) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    if (!user.verified) {
      return res.status(400).send({ error: 'Please verify your email before logging in.' });
    }
    const token = jwt.sign({
      id: user._id,
      role: user.role,
      fullname: user.fullname,
      email: user.email,
      verified: user.verified
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user._id, 
        fullname: user.fullname, 
        email: user.email, 
        role: user.role, 
        verified: user.verified 
      } 
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Email not found' });
    }
    const resetCode = generateResetCode();
    user.resetCode = resetCode;
    await user.save();
    sendResetCodeEmail(user, resetCode);
    res.send({ message: 'Password reset code sent' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;
  try {
    const user = await User.findOne({ email, resetCode });
    if (!user) {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email' });
    }
    user.password = await bcrypt.hash(newPassword, 8);
    user.resetCode = null;
    await user.save();
    res.send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log(token); // Fix the typo here
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).send({ error: 'Invalid token' });
    }
    if (user.verified) {
      return res.status(400).send({ error: 'Email already verified' });
    }
    user.verified = true;
    await user.save();
    res.send({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetCode');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { fullname, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { fullname, email }, { new: true });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user || !await bcrypt.compare(oldPassword, user.password)) {
      return res.status(400).send({ error: 'Invalid old password' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ error: 'Passwords do not match' });
    }
    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();
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
  getUserById,
  updateProfile,
  changePassword
};
