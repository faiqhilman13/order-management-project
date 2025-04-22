# Order Management System

A complete microservice-based e-commerce application that demonstrates the end-to-end flow from product browsing to order completion.

## 🌟 Features

- **Product Management**: Browse catalog of products
- **Cart Management**: Add products to cart, update quantities, remove items
- **Order Processing**: Place orders, view order details
- **Microservice Architecture**: Separate services for Products, Cart, and Orders

## 🏗️ System Architecture

The application consists of four main components:

1. **Product Service** (Port 5001): Manages product catalog
2. **Cart Service** (Port 5002): Handles shopping cart functionality
3. **Order Service** (Port 5003): Processes and manages orders
4. **Frontend Application** (Port 3000): Provides the user interface

Each service operates independently with its own database and communicates with other services via RESTful APIs.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Communication**: Axios for inter-service HTTP requests

### Frontend
- **Framework**: React
- **UI Library**: React Bootstrap
- **Routing**: React Router DOM
- **API Client**: Axios

## 📋 Prerequisites

- Node.js (if using v16+, see special instructions below)
- MongoDB installed and running on localhost:27017
- Basic familiarity with terminal commands

## 🚀 Getting Started

### Option 1: Using the run.js Script (Recommended for Command Prompt/Bash)

```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd order-management-system

# Ensure MongoDB is running

# Run all services at once
node run.js

# In a new terminal, seed the product database
curl -X POST http://localhost:5001/api/products/seed

# Access the application
# Open http://localhost:3000 in your browser
```

### Option 2: Starting Services Individually

For troubleshooting or when using PowerShell:

#### Step 1: Prepare Frontend (for Node.js v16+)

If using Node.js v16+, modify `frontend/package.json` scripts:

```json
"scripts": {
  "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
  "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

#### Step 2: Start Each Service

Start each service in a separate terminal window:

**Terminal 1 - Product Service**:
```bash
cd services/product-service
npm install
node server.js
```

**Terminal 2 - Cart Service**:
```bash
cd services/cart-service
npm install
node server.js
```

**Terminal 3 - Order Service**:
```bash
cd services/order-service
npm install
node server.js
```

**Terminal 4 - Frontend**:
```bash
cd frontend
npm install
npm start
```

#### Step 3: Seed Products

In a new terminal:

```bash
# For Command Prompt/Bash
curl -X POST http://localhost:5001/api/products/seed

# For PowerShell
Invoke-WebRequest -Method POST -Uri http://localhost:5001/api/products/seed
```

## 📝 API Documentation

### Product Service (http://localhost:5001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get a specific product |
| `/api/products/seed` | POST | Seed database with sample products |

### Cart Service (http://localhost:5002)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cart` | GET | Get current cart |
| `/api/cart` | POST | Add item to cart |
| `/api/cart/:productId` | PUT | Update item quantity |
| `/api/cart/:productId` | DELETE | Remove item from cart |
| `/api/cart` | DELETE | Clear entire cart |

### Order Service (http://localhost:5003)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | Get all orders |
| `/api/orders/:id` | GET | Get specific order |
| `/api/orders` | POST | Create a new order |
| `/api/orders/:id` | PATCH | Update order status |

## 🔍 User Workflow

1. Browse products on the home page
2. Add products to cart using "Add to Cart" button
3. View and modify cart by clicking "Cart" in the navigation
4. Place order from the cart page
5. View order confirmation with details

## 🐛 Troubleshooting

### Ports Already in Use

If you see errors like `EADDRINUSE: address already in use :::5001`:

```bash
# Find process using the port (Windows)
netstat -ano | findstr :5001

# Kill that process
taskkill /PID <PID> /F
```

### Node.js Crypto Error

If running with Node.js v16+, you might see `error:0308010C:digital envelope routines::unsupported`. Fix by updating frontend scripts as shown above.

### PowerShell Commands

PowerShell uses different syntax for some commands:

```powershell
# Instead of curl
Invoke-WebRequest -Method POST -Uri http://localhost:5001/api/products/seed
```

## 📚 Project Structure

```
order-management-system/
├── frontend/                   # React frontend application
├── services/                   # Backend microservices
│   ├── product-service/        # Product service (port 5001)
│   ├── cart-service/           # Cart service (port 5002)
│   └── order-service/          # Order service (port 5003)
├── run.js                      # Script to run all services
├── project_notes.md            # Technical documentation
└── explanation.md              # Code explanation
```

## 🌱 Simplifications for Demo

- Uses a default user ID ('default-user') instead of authentication
- Shipping address is set to a default value if not provided
- Error handling is basic
- No payment processing is implemented

## 🔮 Future Enhancements

- User authentication
- Admin dashboard
- Payment processing
- Enhanced user experience (search, reviews, etc.)
- Technical improvements (caching, testing, etc.)

## 📄 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgements

- Express.js
- React
- MongoDB
- Bootstrap 