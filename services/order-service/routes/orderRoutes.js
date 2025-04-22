const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

const CART_SERVICE_URL = 'http://localhost:5002/api/cart';

// Get all orders for a user
router.get('/', async (req, res) => {
  try {
    const userId = 'default-user'; // In a real app, get from auth
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const userId = 'default-user'; // In a real app, get from auth
    const { shippingAddress } = req.body;
    
    // Get cart from Cart Service
    const cartResponse = await axios.get(CART_SERVICE_URL);
    const cart = cartResponse.data;
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cannot create order with empty cart' });
    }
    
    // Create new order
    const order = new Order({
      userId,
      items: cart.items,
      total: cart.total,
      shippingAddress: shippingAddress || '123 Default Address'
    });
    
    const savedOrder = await order.save();
    
    // Clear the cart after order is created
    await axios.delete(CART_SERVICE_URL);
    
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 