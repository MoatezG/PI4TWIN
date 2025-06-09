const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demanderSchema = new Schema({
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  location: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

// Remove any route-related code from this file
// This should ONLY contain the schema definition

module.exports = mongoose.model('Demander', demanderSchema);