const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cart-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for Cart Service'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/cart', cartRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
}); 