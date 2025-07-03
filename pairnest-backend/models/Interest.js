const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  minAge: Number,
  maxAge: Number,
  location: String,
  profession: String,
  temperament: String,
  religion: String,
  tribe: String,
  loveLanguage: String
}, { timestamps: true });

module.exports = mongoose.model('Interest', interestSchema);
