const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  temperament: {
    type: String,
    required: true,
  },
  loveLanguage: {
    type: String,
    required: true,
  },
  tribe: {
    type: String,
    required: true,
  },
  hobbies: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
