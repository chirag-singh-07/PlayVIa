const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const admin = new User({
      username: 'admin',
      email: 'admin@playvia.app',
      password: 'adminpassword123', // User should change this immediately
      role: 'admin',
      isVerified: true,
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@playvia.app');
    console.log('Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
