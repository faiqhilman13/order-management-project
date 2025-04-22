const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/order-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for Order Service'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/orders', orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
}); 