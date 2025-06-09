const express = require('express');
const router = express.Router();
const {
    createProvider,
    getProviders,
    getProviderById,
    updateProvider,
    deleteProvider,
    getProvidersByCategory,
    rateProvider,
    getByUserId // Add this import
} = require('../controllers/providerController');

// Add the missing route
router.get('/user/:userId', getByUserId);

// Existing routes
router.post('/', createProvider);
router.get('/', getProviders);
router.get('/category/:category', getProvidersByCategory);
router.get('/:id', getProviderById);
router.put('/:id', updateProvider);
router.delete('/:id', deleteProvider);
router.post('/:id/rate', rateProvider);
router.get('/user/:userId', getByUserId);

module.exports = router;