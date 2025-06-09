const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { authenticate, logRequests } = require('../middleware');

router.use(logRequests);

router.post('/', authenticate, createOrder);

router.get('/', authenticate, getOrders);

router.get('/:id', authenticate, getOrderById);

router.put('/:id', authenticate, updateOrderStatus);

router.delete('/:id', authenticate, deleteOrder);

module.exports = router;
