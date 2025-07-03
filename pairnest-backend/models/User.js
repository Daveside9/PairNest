const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ✅ Define schema with all fields
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  profilePic: {
    type: String,
    default: '', // Optional profile picture URL
  },
  isAdmin: {
  type: Boolean,
  default: false
}
}, { timestamps: true });

// ✅ Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Password comparison method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Export model
module.exports = mongoose.model('User', UserSchema);
