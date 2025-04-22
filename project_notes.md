# Order Management System - Technical Documentation

## Project Overview

This Order Management System is a complete microservice-based application that demonstrates a full e-commerce flow from product browsing to order completion. The system is built with a modern JavaScript stack and follows microservice architecture principles to ensure scalability, maintainability, and separation of concerns.

## System Architecture

The application consists of four main components:

1. **Product Service** - Manages product catalog and information
2. **Cart Service** - Handles shopping cart functionality
3. **Order Service** - Processes and manages orders
4. **Frontend Application** - Provides the user interface

Each service operates independently with its own database and communicates with other services via RESTful APIs.

## Technology Stack

### Backend Services
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Communication**: Axios for inter-service HTTP requests
- **Development**: Nodemon for hot reloading during development

### Frontend
- **Framework**: React
- **UI Library**: React Bootstrap
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Bootstrap CSS

## Detailed Service Breakdown

### 1. Product Service (Port 5001)

**Purpose**: 
Manages the product catalog and provides product information to other services and the frontend.

**API Endpoints**:
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Get a specific product by ID
- `POST /api/products/seed` - Populate the database with sample products

**Data Model**:
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };

**Dependencies**:
- express: ^4.17.1 - Web framework
- mongoose: ^6.0.12 - MongoDB ODM
- cors: ^2.8.5 - Cross-Origin Resource Sharing middleware
- axios: ^0.24.0 - HTTP client for service-to-service communication
- nodemon: ^2.0.14 (dev dependency) - Auto-restart during development

**Service Interactions**:
- Communicates with Cart Service to get cart contents when creating an order
- Requests Cart Service to clear the cart after order creation

### 2. Cart Service (Port 5002)

**Purpose**: 
Manages shopping carts for users, including adding, updating, and removing items.

**API Endpoints**:
- `GET /api/cart` - Get current cart contents
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

**Data Model**:
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

**Dependencies**:
- express: ^4.17.1 - Web framework
- mongoose: ^6.0.12 - MongoDB ODM
- cors: ^2.8.5 - Cross-Origin Resource Sharing middleware
- axios: ^0.24.0 - HTTP client for service-to-service communication
- nodemon: ^2.0.14 (dev dependency) - Auto-restart during development

**Service Interactions**:
- Communicates with Product Service to get product details when adding items to cart

### 3. Order Service (Port 5003)

**Purpose**: 
Processes orders, maintains order history, and manages order status.

**API Endpoints**:
- `GET /api/orders` - Get all orders for current user
- `GET /api/orders/:id` - Get specific order details
- `POST /api/orders` - Create a new order from cart
- `PATCH /api/orders/:id` - Update order status

**Data Model**:
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

**Dependencies**:
- express: ^4.17.1 - Web framework
- mongoose: ^6.0.12 - MongoDB ODM
- cors: ^2.8.5 - Cross-Origin Resource Sharing middleware
- axios: ^0.24.0 - HTTP client for service-to-service communication
- nodemon: ^2.0.14 (dev dependency) - Auto-restart during development

**Service Interactions**:
- Communicates with Cart Service to get cart contents when creating an order
- Requests Cart Service to clear the cart after order creation

### 4. Frontend Application (Port 3000)

**Purpose**: 
Provides the user interface for interacting with the system, including product browsing, cart management, and order placement.

**Key Components**:
- **Header** - Navigation bar with links to products and cart
- **ProductList** - Displays available products in a grid
- **ProductCard** - Shows individual product with add-to-cart functionality
- **CartPage** - Shows cart contents with ability to modify quantities
- **CartItem** - Individual cart item display with quantity controls
- **OrderConfirmation** - Shows order details after placement

**Service Files**:
- **productService.js** - Handles API calls to Product Service
- **cartService.js** - Handles API calls to Cart Service
- **orderService.js** - Handles API calls to Order Service

**Dependencies**:
- react: ^17.0.2 - UI library
- react-dom: ^17.0.2 - React DOM renderer
- react-router-dom: ^6.0.2 - Routing library
- react-bootstrap: ^2.0.0 - Bootstrap components for React
- bootstrap: ^5.1.3 - CSS framework
- axios: ^0.24.0 - HTTP client for API calls
- react-scripts: 4.0.3 - Create React App scripts and configuration

## Data Flow and User Journey

### 1. Product Browsing Flow
- User accesses the application at http://localhost:3000
- Frontend makes a GET request to Product Service for product list
- Product Service returns list of products from MongoDB
- Frontend renders products using ProductCard components
- User can view product details including name, price, and description

### 2. Cart Management Flow
- User clicks "Add to Cart" on a product
- Frontend sends POST request to Cart Service with product ID
- Cart Service fetches product details from Product Service
- Cart Service adds item to cart in MongoDB and calculates total
- User navigates to Cart page to view cart contents
- User can update quantities or remove items
- Each action triggers API calls to Cart Service to update the cart

### 3. Order Placement Flow
- User reviews cart and clicks "Place Order"
- Frontend sends POST request to Order Service
- Order Service retrieves current cart from Cart Service
- Order Service creates new order in MongoDB
- Order Service requests Cart Service to clear the cart
- Frontend navigates to Order Confirmation page
- Order details are displayed to user

## Database Structure

The application uses MongoDB with three separate databases:

1. **product-service** - Stores product information
2. **cart-service** - Stores cart data
3. **order-service** - Stores order information

This separation ensures each service has its own data store, following microservice best practices.

## Running the Application

There are multiple ways to run the application based on your environment. The project includes both a unified approach (`run.js` script) and a manual service-by-service approach.

### Prerequisites
- Node.js installed (if using Node.js v16+, special steps needed for the frontend)
- MongoDB installed and running on localhost:27017
- Basic familiarity with terminal commands

### Option 1: Using the run.js Script (Recommended for Command Prompt/Bash)

The project includes a `run.js` script that handles:
1. Installing dependencies for all services
2. Starting all services concurrently
3. Handling process termination and cleanup

To run the application:

1. Ensure MongoDB is installed and running on localhost:27017
2. Navigate to the project root directory
3. Run `node run.js`
4. Access the frontend at http://localhost:3000
5. Open a new terminal window and seed the product database:
   ```
   # For Command Prompt/Bash
   curl -X POST http://localhost:5001/api/products/seed
   
   # For PowerShell
   Invoke-WebRequest -Method POST -Uri http://localhost:5001/api/products/seed
   ```

### Option 2: Starting Services Individually (Recommended for PowerShell or troubleshooting)

If you encounter issues with the `run.js` script or are using PowerShell, you can start each service individually:

1. **Prepare the Frontend** (for Node.js v16+ compatibility):
   - Open `frontend/package.json`
   - Modify the scripts section:
   ```json
   "scripts": {
     "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
     "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",
     "test": "react-scripts test",
     "eject": "react-scripts eject"
   }
   ```

2. **Start each service in a separate terminal window**:
   
   **Terminal 1 - Product Service**:
   ```
   cd services/product-service
   npm install
   node server.js
   ```
   
   **Terminal 2 - Cart Service**:
   ```
   cd services/cart-service
   npm install
   node server.js
   ```
   
   **Terminal 3 - Order Service**:
   ```
   cd services/order-service
   npm install
   node server.js
   ```
   
   **Terminal 4 - Frontend**:
   ```
   cd frontend
   npm install
   npm start
   ```

3. **Seed the product database**:
   
   **New Terminal**:
   ```
   # For Command Prompt/Bash
   curl -X POST http://localhost:5001/api/products/seed
   
   # For PowerShell
   Invoke-WebRequest -Method POST -Uri http://localhost:5001/api/products/seed
   ```

### Troubleshooting Common Issues

1. **Ports Already in Use**:
   If you see errors like `EADDRINUSE: address already in use :::5001`, it means another process is using that port. To fix:
   
   - For Windows:
     ```
     # Find the process using the port
     netstat -ano | findstr :5001
     
     # Kill the process (replace PID with the process ID from the previous command)
     taskkill /PID <PID> /F
     ```

2. **Node.js Crypto Error**:
   If running with Node.js v16+, you might see `error:0308010C:digital envelope routines::unsupported`. This is fixed by:
   
   - Setting the OpenSSL legacy provider flag:
     ```
     # For Windows Command Prompt
     set NODE_OPTIONS=--openssl-legacy-provider
     npm start
     
     # Or update package.json scripts as shown earlier
     ```

3. **MongoDB Connection Issues**:
   If services can't connect to MongoDB:
   
   - Ensure MongoDB is installed and running
   - Check connection strings in each service's server.js file
   - For Windows, verify MongoDB service is running in Services panel

4. **PowerShell Command Limitations**:
   PowerShell has different syntax for some commands:
   
   - Instead of `curl -X POST <url>`, use:
     ```
     Invoke-WebRequest -Method POST -Uri <url>
     ```
   - For running multiple commands, use semicolons instead of `&&`:
     ```
     cd path/to/directory; node server.js
     ```

### Verifying the Setup

Once all services are running and products are seeded:

1. Navigate to http://localhost:3000 in your browser
2. You should see a list of products
3. Try adding products to cart, viewing cart, and placing orders
4. If any service isn't working, check its respective terminal for error messages

## Implementation Notes

### Simplifications for Demo Purposes
- The application uses a default user ID ('default-user') instead of implementing authentication
- Shipping address is set to a default value if not provided
- Error handling is basic and could be enhanced for production
- No payment processing is implemented

### Production Considerations
- Implement proper user authentication and authorization
- Add comprehensive error handling and logging
- Use environment variables for configuration
- Implement API gateway for frontend-to-service communication
- Add message queues for asynchronous processing
- Containerize services with Docker
- Set up CI/CD pipelines
- Implement monitoring and alerting

## Future Enhancements

1. **User Authentication**
   - Implement user registration and login
   - Secure API endpoints
   - Maintain user-specific carts and orders

2. **Admin Dashboard**
   - Add product management interface
   - Order management and status updates
   - Sales reporting and analytics

3. **Payment Processing**
   - Integrate with payment gateways
   - Handle payment status and confirmation

4. **Enhanced User Experience**
   - Product search and filtering
   - User reviews and ratings
   - Order history and tracking

5. **Technical Improvements**
   - Implement caching for product data
   - Add unit and integration tests
   - Optimize database queries
   - Implement rate limiting and security enhancements

## Deployment Considerations

### Local Development
The current setup is optimized for local development with all services running on the same machine. For production deployment, consider the following approaches:

### Docker Containerization
Each service can be containerized using Docker:

## Example Dockerfile for Product Service
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["node", "server.js"]

Docker Compose can be used to orchestrate all services:
```
version: '3'
services:
  product-service:
    build: ./services/product-service
    ports:
      - "5001:5001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/product-service
    depends_on:
      - mongo
  
  cart-service:
    build: ./services/cart-service
    ports:
      - "5002:5002"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/cart-service
      - PRODUCT_SERVICE_URL=http://product-service:5001/api/products
    depends_on:
      - mongo
      - product-service
  
  order-service:
    build: ./services/order-service
    ports:
      - "5003:5003"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/order-service
      - CART_SERVICE_URL=http://cart-service:5002/api/cart
    depends_on:
      - mongo
      - cart-service
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_PRODUCT_SERVICE_URL=http://localhost:5001/api/products
      - REACT_APP_CART_SERVICE_URL=http://localhost:5002/api/cart
      - REACT_APP_ORDER_SERVICE_URL=http://localhost:5003/api/orders
    depends_on:
      - product-service
      - cart-service
      - order-service
  
  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:

### Cloud Deployment

For cloud deployment, consider these options:

1. **Kubernetes**
   - Deploy each service as a separate pod
   - Use Kubernetes services for service discovery
   - Implement horizontal pod autoscaling for handling load

2. **AWS Deployment**
   - EC2 instances or ECS for services
   - DynamoDB or MongoDB Atlas for databases
   - API Gateway for frontend-to-service communication
   - CloudWatch for monitoring and logging

3. **Serverless Architecture**
   - Convert services to AWS Lambda functions
   - Use API Gateway to expose endpoints
   - DynamoDB for data storage
   - S3 and CloudFront for frontend hosting

## Monitoring and Maintenance

For production deployments, implement:

1. **Health Checks**
   - Add `/health` endpoints to each service
   - Implement readiness and liveness probes for Kubernetes

2. **Logging**
   - Centralized logging with ELK stack or CloudWatch
   - Structured logging format for easier analysis

3. **Metrics**
   - Collect performance metrics
   - Monitor service response times
   - Track error rates and system resource usage

4. **Alerting**
   - Set up alerts for service outages
   - Monitor for unusual patterns in orders or cart activity
   - Implement on-call rotation for critical issues

## Security Considerations

1. **API Security**
   - Implement rate limiting
   - Use JWT for authentication
   - Validate all input data
   - Implement HTTPS for all communications

2. **Database Security**
   - Use strong authentication
   - Implement network security groups
   - Regular security audits
   - Backup and recovery procedures

3. **Frontend Security**
   - Implement CSP (Content Security Policy)
   - Use HTTPS
   - Protect against XSS and CSRF attacks

## Conclusion

This Order Management System demonstrates a complete microservice architecture for e-commerce operations. While designed as a demonstration project, it includes all the core components needed for a production system and can be extended with additional features as needed.

The separation of concerns between services allows for independent scaling and development of each component, making the system more maintainable and resilient. The React frontend provides a modern user experience with responsive design principles.

By following the deployment and security considerations outlined above, this system can be adapted for production use with appropriate enhancements for authentication, payment processing, and monitoring.