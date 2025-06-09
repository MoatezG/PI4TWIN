const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['Provider', 'Demander', 'Admin'], required: true },
  created_at: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  resetCode: { type: String },
  googleId: { type: String, unique: true, sparse: true } // Add googleId field
});

module.exports = mongoose.model('User', userSchema);
