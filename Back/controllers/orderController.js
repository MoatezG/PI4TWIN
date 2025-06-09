const Order = require('../models/Order');
const Product = require('../models/Product');

// Créer une commande
const createOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const user = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send({ error: 'Order must contain at least one item.' });
    }

    if (!address) {
      return res.status(400).send({ error: 'Delivery address is required.' });
    }

    let orderItems = [];
    let totalPrice = 0;

    for (let item of items) {
      const { product, quantity } = item;
      const productData = await Product.findById(product);
      if (!productData) {
        return res.status(400).send({ error: `Product with id ${product} not found.` });
      }
      const itemPrice = productData.price_per_unit;
      const itemTotal = itemPrice * quantity;
      totalPrice += itemTotal;

      orderItems.push({
        product,
        quantity,
        price: itemPrice
      });
    }

    const order = new Order({
      user,
      items: orderItems,
      totalPrice,
      address,
      isPaid: false
    });

    await order.save();
    res.status(201).send({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// 🆕 Récupérer toutes les commandes
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🆕 Récupérer une commande par ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🆕 Mettre à jour le statut d’une commande
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🆕 Supprimer une commande
const deleteOrder = async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
