// makeAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    ensureAdminUser();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

async function ensureAdminUser() {
  try {
    const email = 'daveside00468@gmail.com';
    const password = 'Davometer00468'; 

    let user = await User.findOne({ email });

    if (!user) {
      // Create the user
      user = new User({ email, password, isAdmin: true });
      await user.save();
      console.log(`✅ Admin user "${email}" created.`);
    } else if (!user.isAdmin) {
      // Promote if exists but not admin
      user.isAdmin = true;
      await user.save();
      console.log(`✅ User "${email}" promoted to admin.`);
    } else {
      console.log(`ℹ️ User "${email}" is already an admin.`);
    }
  } catch (err) {
    console.error('❌ Error creating/promoting admin:', err.message);
  } finally {
    mongoose.disconnect();
  }
}
