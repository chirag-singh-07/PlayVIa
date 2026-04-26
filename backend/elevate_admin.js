const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const elevateToAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully elevated ${email} to admin role.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address: node elevate_admin.js your@email.com');
  process.exit(1);
}

elevateToAdmin(email);
