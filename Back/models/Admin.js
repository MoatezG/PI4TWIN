const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  fullname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  verified: { type: Boolean, default: true },
  resetCode: { type: String }
});

module.exports = mongoose.model('Admin', adminSchema);
