const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerSchema = new Schema({
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  businessType: { type: String, required: true },
  categories: [{ type: String }], // Array of categories like "Fruits, Baked Goods"
  quantity: { type: String, default: "0 items available" }, // String like "10 items available"
  pickupTimes: { type: String, required: true }, // String like "9 AM - 5 PM"
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  badges: [{ type: String }], // e.g., Gold, Silver, Bronze
  imageUrl: { type: String }, // URL to the provider's image
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
