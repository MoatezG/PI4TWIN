const Provider = require('../models/Provider');
const mongoose = require('mongoose');

const createProvider = async (req, res) => {
  try {
    const provider = new Provider({
      ...req.body,
      businessType: req.body.businessType,
      categories: req.body.categories || [],
      quantity: req.body.quantity || "0 items available",
      pickupTimes: req.body.pickupTimes,
      rating: req.body.rating || "0 ",
      imageUrl: req.body.imageUrl
    });
    await provider.save();
    res.status(201).send(provider);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getProviders = async (req, res) => {
  try {
    const { category, businessType, rating } = req.query;
    let query = {};

    // Add filters if they exist in the query
    if (category) {
      query.categories = { $in: [category] };
    }
    if (businessType) {
      query.businessType = businessType;
    }
    if (rating) {
      // Extract numeric rating from string (e.g., "4.5 " -> 4.5)
      const numericRating = parseFloat(rating);
      if (!isNaN(numericRating)) {
        query.rating = { $regex: `^${numericRating}` };
      }
    }

    const providers = await Provider.find(query);
    res.send(providers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).send({ error: 'Provider not found' });
    }
    res.send(provider);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      businessType: req.body.businessType,
      categories: req.body.categories,
      quantity: req.body.quantity,
      pickupTimes: req.body.pickupTimes,
      rating: req.body.rating,
      imageUrl: req.body.imageUrl
    };

    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).send({ error: 'Provider not found' });
    }
    res.send(provider);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).send({ error: 'Provider not found' });
    }
    res.send({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// New endpoint to get providers by category
const getProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const providers = await Provider.find({
      categories: { $in: [category] }
    });
    res.send(providers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Helper: Assign badges based on averageRating
function assignProviderBadge(provider) {
  let badge = null;
  if (provider.ratingCount >= 5) {
    if (provider.averageRating >= 4.5) badge = 'Gold';
    else if (provider.averageRating >= 3.5) badge = 'Silver';
    else if (provider.averageRating >= 2.5) badge = 'Bronze';
  }
  provider.badges = badge ? [badge] : [];
}

// POST /providers/:id/rate
const rateProvider = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ error: 'Provider not found' });

    // Update averageRating and ratingCount
    const oldAvg = provider.averageRating || 0;
    const oldCount = provider.ratingCount || 0;
    const newAvg = ((oldAvg * oldCount) + rating) / (oldCount + 1);
    provider.averageRating = newAvg;
    provider.ratingCount = oldCount + 1;

    // Assign badge
    assignProviderBadge(provider);

    await provider.save();
    res.json({ averageRating: provider.averageRating, ratingCount: provider.ratingCount, badges: provider.badges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const providers = await Provider.find({ user_id: userId }); // Match schema's user_id field
    
    res.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};
// Add this to your exports at the bottom
module.exports = {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
  getProvidersByCategory,
  rateProvider,
  getByUserId // Add this export
};