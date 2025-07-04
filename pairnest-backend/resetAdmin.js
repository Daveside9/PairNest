// resetAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const email = 'daveside00468@gmail.com';
const password = 'Davometer00468';

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return resetAdmin();
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });

async function resetAdmin() {
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      await User.deleteOne({ email });
      console.log(`🗑️ Deleted old user "${email}"`);
    }

    const newUser = new User({ email, password, isAdmin: true });
    await newUser.save();
    console.log(`✅ New admin "${email}" created successfully`);
  } catch (err) {
    console.error('❌ Error resetting admin user:', err.message);
  } finally {
    mongoose.disconnect();
  }
}
