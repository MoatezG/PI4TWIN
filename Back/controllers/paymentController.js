const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { products, orderId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(product => ({
        price_data: {
          currency: 'usd',
          product_data: { name: product.name },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: `http://localhost:3000/order-success?orderId=${orderId}`,
      cancel_url: `http://localhost:3000/order-cancelled`,
    });

    // 🔁 Lier la session Stripe à la commande
    await Order.findByIdAndUpdate(orderId, {
      paymentSessionId: session.id,
      isPaid: false
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};
