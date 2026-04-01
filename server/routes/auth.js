const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure email transporter
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com' || emailPass === 'your-app-password-here') {
    console.error('⚠️  EMAIL CONFIG ERROR: EMAIL_USER and EMAIL_PASS must be set in .env file with real credentials.');
    console.error('   EMAIL_USER is:', emailUser ? `"${emailUser}"` : 'MISSING');
    console.error('   EMAIL_PASS is:', emailPass ? 'SET (hidden)' : 'MISSING');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, language } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'buyer',
      phone,
      language: language || 'en'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'shilpkari_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Handle common, user-friendly errors
    if (error?.name === 'ValidationError') {
      // Extract first validation message if available
      const firstKey = Object.keys(error.errors)[0];
      const msg = error.errors[firstKey]?.message || 'Invalid input';
      return res.status(400).json({ message: msg });
    }
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    if (typeof error?.message === 'string' && error.message.toLowerCase().includes('minlength')) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'shilpkari_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password - Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetURL = `${clientURL}/reset-password/${resetToken}`;

    // Send email
    const transporter = createTransporter();

    if (!transporter) {
      console.error('Cannot send reset email: Email transporter not configured. Check EMAIL_USER and EMAIL_PASS in .env');
      return res.status(500).json({ message: 'Email service is not configured. Please contact support.' });
    }

    const mailOptions = {
      from: `"शिल्पकारी - Shilpkari" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - शिल्पकारी',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif; background: #fdfcfb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1e0a03, #50230a); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 800;">शिल्पकारी</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 8px;">Artisan Marketplace</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #111827; font-size: 22px; margin: 0 0 16px;">Password Reset Request</h2>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Hi <strong>${user.name}</strong>,<br><br>
              We received a request to reset your password. Click the button below to create a new password. This link will expire in <strong>1 hour</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, #d97706, #b45309); color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(217,119,6,0.3);">
                Reset My Password
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 24px 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              If you didn't request this, you can safely ignore this email. Your password will remain unchanged.<br><br>
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetURL}" style="color: #d97706; word-break: break-all;">${resetURL}</a>
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
  }
});

// Reset Password - Verify token and update password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"शिल्पकारी - Shilpkari" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Changed Successfully - शिल्पकारी',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif; background: #fdfcfb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #1e0a03, #50230a); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 800;">शिल्पकारी</h1>
              <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 8px;">Artisan Marketplace</p>
            </div>
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px;">✅</div>
              </div>
              <h2 style="color: #111827; font-size: 22px; margin: 0 0 16px; text-align: center;">Password Changed Successfully</h2>
              <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                Hi <strong>${user.name}</strong>,<br><br>
                Your password has been successfully changed. You can now log in with your new password.
              </p>
              <p style="color: #ef4444; font-size: 13px; line-height: 1.6; margin: 24px 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                If you did not make this change, please contact our support team immediately.
              </p>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      // Don't fail the reset if confirmation email fails
      console.error('Confirmation email error:', emailErr);
    }

    res.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
