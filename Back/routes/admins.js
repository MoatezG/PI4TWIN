const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, verifyResetCode, resetPassword, verifyEmail, getAdminById, updateProfile, changePassword } = require('../controllers/adminController');
const { authenticate, logRequests } = require('../middleware');

// Middleware to log requests
router.use(logRequests);

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Verify reset code route
router.post('/verify-reset-code', verifyResetCode);

// Reset password route
router.post('/reset-password', resetPassword);

// Email verification route
router.get('/verify-email', verifyEmail);

// Get admin data by ID
router.get('/:id', getAdminById);

// Update profile route
router.put('/:id', authenticate, updateProfile);

// Change password route
router.post('/change-password', authenticate, changePassword);

module.exports = router;
