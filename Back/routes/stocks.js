const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

router.get('/provider/:providerId', StockController.getProviderStock);
router.get('/demander/:demanderId', StockController.getDemanderStock);
router.post('/fill-stock/provider', StockController.fillStockFromProductList);
router.post('/fill-stock/demander', StockController.fillStockFromProvider);
// Add these new routes
router.get('/check-stock/:userId', StockController.checkStockExists);
router.post('/initialize/provider', StockController.initializeProviderStock);
router.post('/initialize/demander', StockController.initializeDemanderStock);
router.get('/providers/user/:userId', StockController.getProvidersByUserId);
router.post('/get-or-create/provider', StockController.getOrCreateProviderStock);
router.post('/get-or-create/demander', StockController.getOrCreateDemanderStock);
module.exports = router;