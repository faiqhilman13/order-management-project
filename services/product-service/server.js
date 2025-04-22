const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/product-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for Product Service'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
}); 