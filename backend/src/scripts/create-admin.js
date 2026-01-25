const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not set in .env file');
      console.error('Please make sure you have a .env file in the backend directory with MONGODB_URI');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const args = process.argv.slice(2);

    if (args.length < 4) {
      console.error('Usage: node create-admin.js <email> <password> <firstName> <lastName>');
      console.error('Example: npm run create-admin admin@gov.gov password123 "John" "Doe"');
      process.exit(1);
    }

    const email = args[0];
    const password = args[1];
    const firstName = args[2];
    const lastName = args.slice(3).join(' ');

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.error('User with this email already exists');
      process.exit(1);
    }

    const admin = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin user created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`Role: ${admin.role}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdminUser();
