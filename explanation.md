# Order Management System - Code Explanation

This document provides a detailed explanation of the code structure, dependencies, and interactions between different components of the Order Management System.

## System Overview

The Order Management System is built using a microservice architecture with three backend services and a React frontend. Each service has its own responsibility and data store, communicating with other services via RESTful APIs.

## Code Structure and Dependencies

### 1. Product Service

**Key Files:**
- `server.js`: Entry point that sets up Express server and MongoDB connection
- `models/Product.js`: Defines the product schema and model
- `routes/productRoutes.js`: Implements API endpoints for product operations

**Dependencies:**
- Express: Handles HTTP requests and routing
- Mongoose: ODM for MongoDB interaction
- CORS: Enables cross-origin requests

**Key Functionality:**
```javascript
// Product schema definition (models/Product.js)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
```

```javascript
// Product routes (routes/productRoutes.js)
// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed products endpoint
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      { name: 'Laptop', price: 999.99, description: 'High-performance laptop with 16GB RAM' },
      // ... other products
    ];
    const createdProducts = await Product.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

### 2. Cart Service

**Key Files:**
- `server.js`: Entry point that sets up Express server and MongoDB connection
- `models/Cart.js`: Defines the cart schema and model
- `routes/cartRoutes.js`: Implements API endpoints for cart operations

**Dependencies:**
- Express: Handles HTTP requests and routing
- Mongoose: ODM for MongoDB interaction
- CORS: Enables cross-origin requests
- Axios: Makes HTTP requests to Product Service

**Key Functionality:**
```javascript
// Cart schema definition (models/Cart.js)
const cartItemSchema = new mongoose.Schema({
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
    required: true,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user'
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});
```

```javascript
// Cart routes (routes/cartRoutes.js)
// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = 'default-user';
    
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
```

### 3. Order Service

**Key Files:**
- `server.js`: Entry point that sets up Express server and MongoDB connection
- `models/Order.js`: Defines the order schema and model
- `routes/orderRoutes.js`: Implements API endpoints for order operations

**Dependencies:**
- Express: Handles HTTP requests and routing
- Mongoose: ODM for MongoDB interaction
- CORS: Enables cross-origin requests
- Axios: Makes HTTP requests to Cart Service

**Key Functionality:**
```javascript
// Order schema definition (models/Order.js)
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
    default: 'default-user'
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
```

```javascript
// Order routes (routes/orderRoutes.js)
// Create a new order
router.post('/', async (req, res) => {
  try {
    const userId = 'default-user';
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
```

### 4. Frontend Application

**Key Files:**
- `src/App.js`: Main component that sets up routing
- `src/components/`: UI components like Header, ProductCard, CartItem
- `src/pages/`: Page components like ProductList, CartPage, OrderConfirmation
- `src/services/`: Service modules for API communication

**Dependencies:**
- React: UI library
- React Router: Handles client-side routing
- React Bootstrap: UI component library
- Axios: Makes HTTP requests to backend services

**Key Functionality:**
```javascript
// App.js - Main routing setup
function App() {
  return (
    <Router>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
        </Routes>
      </Container>
    </Router>
  );
}
```

```javascript
// productService.js - API communication with Product Service
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

```javascript
// ProductList.js - Fetching and displaying products
const ProductList = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Render product list
}
```

## Service Interactions and Data Flow

### 1. Product Browsing Flow

```
Frontend (ProductList) → Product Service → MongoDB → Frontend
```

1. The `ProductList` component calls `getProducts()` from `productService.js`
2. `productService.js` makes a GET request to Product Service API
3. Product Service queries MongoDB for all products
4. Data flows back to the frontend and is displayed to the user

### 2. Adding to Cart Flow

```
Frontend (ProductCard) → Cart Service → Product Service → MongoDB → Frontend
```

1. User clicks "Add to Cart" on a `ProductCard` component
2. `ProductCard` calls `addToCart()` from `cartService.js`
3. `cartService.js` makes a POST request to Cart Service API with product ID
4. Cart Service makes a GET request to Product Service to get product details
5. Cart Service updates or creates a cart in MongoDB
6. Updated cart data flows back to the frontend

### 3. Order Placement Flow

```
Frontend (CartPage) → Order Service → Cart Service → MongoDB → Frontend
```

1. User clicks "Place Order" on the `CartPage` component
2. `CartPage` calls `createOrder()` from `orderService.js`
3. `orderService.js` makes a POST request to Order Service API
4. Order Service makes a GET request to Cart Service to get current cart
5. Order Service creates a new order in MongoDB
6. Order Service makes a DELETE request to Cart Service to clear the cart
7. Order ID flows back to the frontend, which redirects to the order confirmation page

## Run Script Explanation

The `run.js` script orchestrates the startup of all services:

```javascript
// Paths to services
const SERVICES = [
  { name: 'Product Service', path: './services/product-service' },
  { name: 'Cart Service', path: './services/cart-service' },
  { name: 'Order Service', path: './services/order-service' },
  { name: 'Frontend', path: './frontend' }
];

// Function to install dependencies
const installDependencies = (servicePath) => {
  // Implementation details
};

// Function to start a service
const startService = (service) => {
  // Implementation details
};

// Main function to run the application
const runApp = async () => {
  try {
    // Install dependencies for all services
    for (const service of SERVICES) {
      await installDependencies(service.path);
    }
    
    // Start all services
    const processes = SERVICES.map(service => startService(service));
    
    // Handle process termination
    const cleanup = () => {
      console.log('Shutting down all services...');
      processes.forEach(process => {
        process.kill();
      });
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (error) {
    console.error('Error running application:', error);
    process.exit(1);
  }
};

// Run the application
runApp();
```

This script:
1. Defines the paths to all services
2. Provides functions to install dependencies and start services
3. Runs these functions in sequence
4. Sets up cleanup handlers for graceful shutdown

## Running the Application Successfully

Successfully running the Order Management System requires addressing several environment-specific considerations. This section explains how to handle common scenarios and troubleshoot issues.

### Environment Compatibility

#### Node.js Version Considerations

The system uses React 17 with Create React App 4, which has compatibility issues with newer Node.js versions (v16+) due to OpenSSL changes. This manifests as an error in the frontend:

```
Error: error:0308010C:digital envelope routines::unsupported
```

**Solution**:
- For Node.js v16+, modify the frontend's package.json scripts to use the legacy provider:

```json
"scripts": {
  "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
  "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

#### Shell-Specific Commands

Commands differ between Command Prompt, Bash, and PowerShell:

**For Command Prompt/Bash**:
```bash
# Chain commands
cd services/product-service && npm start

# Seed products
curl -X POST http://localhost:5001/api/products/seed
```

**For PowerShell**:
```powershell
# Chain commands (use semicolon instead of &&)
cd services/product-service; npm start

# Seed products (use Invoke-WebRequest instead of curl)
Invoke-WebRequest -Method POST -Uri http://localhost:5001/api/products/seed
```

### Running Strategies

#### Option 1: Using run.js (Command Prompt or Bash)

The simplest approach for Command Prompt or Bash users:

```bash
# Navigate to project root
cd "Order management project"

# Run all services
node run.js

# Open a new terminal to seed products
curl -X POST http://localhost:5001/api/products/seed
```

#### Option 2: Starting Services Individually (all shells, including PowerShell)

For troubleshooting or when using PowerShell:

1. Start each service in a separate terminal:

```
# Terminal 1 - Product Service
cd services/product-service
node server.js

# Terminal 2 - Cart Service
cd services/cart-service
node server.js

# Terminal 3 - Order Service
cd services/order-service
node server.js

# Terminal 4 - Frontend
cd frontend
npm start  # (modified for Node.js v16+ as described above)
```

2. Seed the products in a new terminal when all services are running.

### Troubleshooting Common Issues

#### Port Conflicts

If you see `EADDRINUSE: address already in use` errors:

```
# Find which process is using the port (Windows)
netstat -ano | findstr :5001

# Kill that process
taskkill /PID <PID> /F
```

#### MongoDB Connection Issues

If services can't connect to MongoDB:

1. Ensure MongoDB is running on localhost:27017
2. Check MongoDB connection strings in each service's server.js file:

```javascript
mongoose.connect('mongodb://localhost:27017/product-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

#### Process Management

To gracefully shut down all services:
- If using `run.js`: Press Ctrl+C in that terminal
- If starting individually: Press Ctrl+C in each terminal

### Verifying Correct Operation

To verify the system is working correctly:

1. Open http://localhost:3000 in a browser
2. Check the product listing page shows seeded products
3. Test adding a product to cart
4. Navigate to cart and update quantities
5. Place an order and check the order confirmation

A fully functioning system should allow you to complete the entire order flow from product browsing to order confirmation.

## Conclusion

The Order Management System demonstrates a complete microservice architecture with:

1. **Separation of Concerns**: Each service has a specific responsibility
2. **Independent Data Stores**: Each service has its own MongoDB database
3. **Service Communication**: Services communicate via RESTful APIs
4. **Frontend Integration**: React frontend interacts with all services

The code is structured to be maintainable and scalable, with clear separation between different components. The system demonstrates key microservice patterns like:

- Service discovery (via hardcoded URLs in this demo)
- Data consistency across services
- Fault isolation (issues in one service don't directly affect others)

This architecture allows for independent scaling and deployment of services, making it suitable for large-scale applications. 