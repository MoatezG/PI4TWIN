const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    // Only allow providers or admins to create products (case-insensitive check)
    const role = req.user?.role?.toLowerCase();
    console.log('DEBUG createProduct req.user:', req.user);
    console.log('DEBUG createProduct role:', role);
    if (!role || (role !== 'provider' && role !== 'admin')) {
      return res.status(403).send({ error: 'Only providers or admins can create products' });
    }
    console.log('DEBUG createProduct req.body:', req.body);
    console.log('DEBUG createProduct req.file:', req.file);
    let productData = { ...req.body };
    if (role === 'provider') {
      delete productData.supplier_id;
      productData.supplier_id = mongoose.Types.ObjectId(req.user.id);
      console.log('DEBUG createProduct supplier_id set to:', productData.supplier_id);
    }
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
      // Accept direct image URL if no file uploaded
      productData.image = req.body.image;
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const mongoose = require('mongoose');
const getProducts = async (req, res) => {
  try {
    let products;
    console.log('User:', req.user);
    const role = req.user && req.user.role && req.user.role.toLowerCase();
    if (role === 'provider') {
      products = await Product.find({ supplier_id: mongoose.Types.ObjectId(req.user.id) });
    } else if (role === 'admin' || role === 'demander') {
      products = await Product.find(); // Admin and demander see all products
    } else {
      return res.status(403).send({ error: 'You are not allowed to view products' });
    }
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

const updateProduct = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'Provider' && req.user.role !== 'Admin')) {
      return res.status(403).send({ error: 'Only providers or admins can update products' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    if (req.user.role === 'Provider' && String(product.supplier_id) !== String(req.user.id)) {
      return res.status(403).send({ error: 'You can only update your own products' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedProduct);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'Provider' && req.user.role !== 'Admin')) {
      return res.status(403).send({ error: 'Only providers or admins can delete products' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    if (req.user.role === 'Provider' && String(product.supplier_id) !== String(req.user.id)) {
      return res.status(403).send({ error: 'You can only delete your own products' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const ExpiresAfter = async (req, res) => {
  try {
    const role = req.user?.role?.toLowerCase();
    if (!role || (role !== 'provider' && role !== 'admin')) {
      return res.status(403).send({ error: 'Only providers or admins can access expiring products' });
    }

    const { days } = req.params;
    const numberOfDays = parseInt(days);

    if (isNaN(numberOfDays) || numberOfDays <= 0) {
      return res.status(400).send({ error: 'Invalid number of days' });
    }

    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(currentDate.getDate() + numberOfDays);

    const query = {
      expiration_date: {
        $lte: targetDate,
        $gt: currentDate
      }
    };

    // Restrict providers to their own products
    if (role === 'provider') {
      query.supplier_id = mongoose.Types.ObjectId(req.user.id);
    }

    const products = await Product.find(query);
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Increment view count
const incrementViewCount = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 }, $set: { popularityScore: undefined } },
      { new: true }
    );
    if (!product) return res.status(404).send({ error: 'Product not found' });
    // Optionally recalculate popularityScore
    product.popularityScore = product.viewCount + 2 * product.reservationCount + 3 * product.pickupCount;
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Increment reservation count
const incrementReservationCount = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { reservationCount: 1 }, $set: { popularityScore: undefined } },
      { new: true }
    );
    if (!product) return res.status(404).send({ error: 'Product not found' });
    product.popularityScore = product.viewCount + 2 * product.reservationCount + 3 * product.pickupCount;
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Increment pickup count
const incrementPickupCount = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { pickupCount: 1 }, $set: { popularityScore: undefined } },
      { new: true }
    );
    if (!product) return res.status(404).send({ error: 'Product not found' });
    product.popularityScore = product.viewCount + 2 * product.reservationCount + 3 * product.pickupCount;
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Increment wasted count
const incrementWastedCount = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { wastedCount: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).send({ error: 'Product not found' });
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get most popular products
const getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ popularityScore: -1 }).limit(10);
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
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
};