const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: String,
  age: Number,
  gender: String,
  profession: String,
  temperament: String,
  loveLanguage: String,
  tribe: String,
  location: String,
  hobbies: String,
  profilePic: String,
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
