const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const getUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can view users' },
      });
    }

    const users = await User.find()
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can create users' },
      });
    }

    const { email, password, firstName, lastName, role = 'policymaker' } = req.body;

    if (!['policymaker', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role. Only policymaker or admin allowed.' },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User with this email already exists' },
      });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      message: 'User created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can create admin accounts' },
      });
    }

    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User with this email already exists' },
      });
    }

    const admin = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phoneNumber,
      role: 'admin',
      isVerified: true,
    });

    const token = generateToken(admin._id, admin.email, admin.role);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
        },
        token,
      },
      message: 'Admin account created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAllAdmins = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can view admin list' },
      });
    }

    const admins = await User.find({ role: 'admin' })
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can delete users' },
      });
    }

    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot delete your own account' },
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot delete admin accounts. Use admin deletion endpoint.' },
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can delete admin accounts' },
      });
    }

    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot delete your own account' },
      });
    }

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({
        success: false,
        error: { message: 'Admin not found' },
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Admin account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  createAdmin,
  getAllAdmins,
  deleteUser,
  deleteAdmin,
};
