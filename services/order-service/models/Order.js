const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user' // In a real app, this would be a user ID
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  shippingAddress: {
    type: String,
    default: '123 Default Address'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 