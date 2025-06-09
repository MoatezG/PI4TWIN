const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  demander_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Demander' },
  products: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: {
      type: Number,
      min: 0,
      default: 0
    },
    unit: { type: String, default: 'unit' },
    source_provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    addedAt: { type: Date, default: Date.now }
  }],
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  unit: { 
    type: String, 
    required: true,
    enum: ['kg', 'L', 'unit', 'g', 'ml'],
    default: 'unit'
  },
  price_per_unit: { 
    type: Number, 
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'out_of_stock', 'expired'],
    default: 'available'
  },
  expiration_date: Date
}, { timestamps: true });

// Auto-update status
stockSchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.status = 'out_of_stock';
  }
  if (this.expiration_date && this.expiration_date < Date.now()) {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Stock', stockSchema);