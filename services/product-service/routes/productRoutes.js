const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create seed data for testing
router.post('/seed', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Create sample products
    const products = [
      { name: 'Laptop', price: 999.99, description: 'High-performance laptop with 16GB RAM' },
      { name: 'Smartphone', price: 699.99, description: 'Latest model with 128GB storage' },
      { name: 'Headphones', price: 149.99, description: 'Noise-cancelling wireless headphones' },
      { name: 'Tablet', price: 349.99, description: '10-inch tablet with 64GB storage' },
      { name: 'Smartwatch', price: 249.99, description: 'Fitness tracking and notifications' }
    ];
    
    const createdProducts = await Product.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 