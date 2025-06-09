const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware');
const upload = require('../middleware/upload');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    ExpiresAfter,
    getProductsByCategory,
    incrementViewCount,
    incrementReservationCount,
    incrementPickupCount,
    incrementWastedCount,
    getPopularProducts
} = require('../controllers/productController');

// Base routes
router.post('/', authenticate, upload.single('image'), createProduct);
router.get('/', authenticate, getProducts);

// Specific routes (must come before dynamic :id routes)
router.get('/expires/:days', authenticate, ExpiresAfter);
router.get('/category/:category', authenticate, getProductsByCategory);
router.get('/popular', authenticate, getPopularProducts);

// Analytics increment routes
router.patch('/:id/view', incrementViewCount);
router.patch('/:id/reserve', incrementReservationCount);
router.patch('/:id/pickup', incrementPickupCount);
router.patch('/:id/waste', incrementWastedCount);

// Dynamic routes (must come after specific routes)
router.get('/:id', authenticate,getProductById);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

// --- Priority Model Prediction Endpoint ---
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
let priorityModel = null;

// Load the model once at startup, with robust logging
(async () => {
  try {
    const modelPath = path.resolve(__dirname, '../priority_model/model.json');
    console.log('[PriorityModel] Attempting to load model from:', modelPath);
    priorityModel = await tf.loadLayersModel('file://' + modelPath);
    console.log('✅ Priority model loaded successfully');
  } catch (e) {
    console.error('❌ Failed to load priority model:', e);
    priorityModel = null;
  }
})();

// POST /priority-predict/:id
// Uses product fields to generate prediction
const Product = require('../models/Product');
router.post('/priority-predict/:id', async (req, res) => {
  try {
    if (!priorityModel) {
      return res.status(503).json({ error: 'Priority model not loaded on server.' });
    }
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Calculate days until expiration
    let days = 0;
    if (product.expiration_date) {
      const exp = new Date(product.expiration_date);
      const now = new Date();
      days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    }
    if (typeof product.temp !== 'number') {
      return res.status(400).json({ error: 'Product temp is missing or not a number', product });
    }
    if (typeof product.cond !== 'number') {
      return res.status(400).json({ error: 'Product cond is missing or not a number', product });
    }
    const temp = product.temp;
    const cond = product.cond;
    // Preprocess as in training
    const input = tf.tensor2d([
      [days / 30, (temp - 30) / 40, (cond - 1) / 4]
    ]);
    const prediction = priorityModel.predict(input);
    const score = (await prediction.data())[0];
    console.log(`[PriorityModel] Prediction for product ${productId} (days=${days}, temp=${temp}, cond=${cond}):`, score);
    res.json({ score });
  } catch (e) {
    console.error('[PriorityModel] Error in prediction endpoint:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// (Optional) Keep the old endpoint for direct/raw prediction


module.exports = router;