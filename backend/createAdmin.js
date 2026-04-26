const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const createOrUpdateAdmin = async () => {
  await connectDB();

  try {
    const adminEmail = 'admin@playvia.app';
    const adminPassword = 'adminpassword123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user found, updating password...');
      admin.password = adminPassword;
      admin.role = 'admin'; // Ensure role is admin
      await admin.save();
      console.log('Admin password updated successfully.');
    } else {
      console.log('Admin user not found, creating a new one...');
      admin = new User({
        username: 'superadmin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true,
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }

    console.log('=================================');
    console.log(`Login URL: http://localhost:5173/admin/login`);
    console.log(`Email:     ${adminEmail}`);
    console.log(`Password:  ${adminPassword}`);
    console.log('=================================');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createOrUpdateAdmin();
