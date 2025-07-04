const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'matched', 'rejected'], default: 'pending' },
  dateBooked: { type: Date },
  location: { type: String },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  feedback: { type: String },
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
