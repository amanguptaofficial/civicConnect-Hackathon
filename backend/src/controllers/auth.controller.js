const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const crypto = require('crypto');

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber, address, city, state, zipCode } = req.body;

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin accounts cannot be created through public registration. Please contact system administrator.' },
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists' },
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'citizen',
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      verificationToken,
    });

    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' },
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' },
      });
    }

    const token = generateToken(user._id, user.email, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Authorization code is required' },
      });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/auth/google/callback` : 'http://localhost:3000/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({
        success: false,
        error: { message: tokenData.error_description || 'Failed to exchange authorization code' },
      });
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (userData.error) {
      return res.status(400).json({
        success: false,
        error: { message: 'Failed to get user information from Google' },
      });
    }

    const { email, given_name: firstName, family_name: lastName, picture: profileImage, id: googleId } = userData;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        profileImage,
        role: 'citizen',
        isVerified: true,
        googleId,
        password: crypto.randomBytes(32).toString('hex'),
      });
    } else {
      user.googleId = googleId;
      if (profileImage && !user.profileImage) {
        user.profileImage = profileImage;
      }
      await user.save();
    }

    const token = generateToken(user._id, user.email, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Google callback error:', error);
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        error: { message: 'Google credential is required' },
      });
    }

    const decodedToken = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    
    const { email, given_name: firstName, family_name: lastName, picture: profileImage, sub: googleId } = decodedToken;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        firstName,
        lastName,
        profileImage,
        role: 'citizen',
        isVerified: true,
        googleId,
        password: crypto.randomBytes(32).toString('hex'),
      });
    } else {
      user.googleId = googleId;
      if (profileImage && !user.profileImage) {
        user.profileImage = profileImage;
      }
      await user.save();
    }

    const token = generateToken(user._id, user.email, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Google login error:', error);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, address, city, state, zipCode, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        profileImage,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset email sent',
      data: { resetToken },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or expired token' },
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  googleCallback,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};
