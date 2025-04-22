const express = require('express');
const router = express.Router();
const axios = require('axios');
const Cart = require('../models/Cart');

const PRODUCT_SERVICE_URL = 'http://localhost:5001/api/products';

// Get cart (create if doesn't exist)
router.get('/', async (req, res) => {
  try {
    const userId = 'default-user'; // In a real app, get from auth
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = 'default-user'; // In a real app, get from auth
    
    // Get product details from Product Service
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
    const product = productResponse.data;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
    }
    
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity
      });
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item quantity
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = 'default-user'; // In a real app, get from auth
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove item from cart
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = 'default-user'; // In a real app, get from auth
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Remove item
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear cart
router.delete('/', async (req, res) => {
  try {
    const userId = 'default-user'; // In a real app, get from auth
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.total = 0;
    
    await cart.save();
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 