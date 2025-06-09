const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    id: Number,
    name: String,
    brand: String,
    category: String,
    barcode: String,
    description: String,
    image: String, // URL to product image
    quantity: Number,
    unit: String, // kg, L, unit, etc.
    price_per_unit: Number,
    expiration_date: Date,
    production_date: Date,  
    origin_country: String,
    supplier_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    viewCount: { type: Number, default: 0 },
    temp: Number, // Storage temperature or product temperature
    cond: Number, // Product condition score (1-5)
    //supermarket_id: Number this must be in the order entity
});

module.exports = mongoose.model('Product', productSchema);