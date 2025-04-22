const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Paths to services
const SERVICES = [
  { name: 'Product Service', path: './services/product-service' },
  { name: 'Cart Service', path: './services/cart-service' },
  { name: 'Order Service', path: './services/order-service' },
  { name: 'Frontend', path: './frontend' }
];

// Function to install dependencies
const installDependencies = (servicePath) => {
  return new Promise((resolve, reject) => {
    console.log(`Installing dependencies for ${servicePath}...`);
    
    const npm = spawn('npm', ['install'], {
      cwd: path.resolve(__dirname, servicePath),
      shell: true
    });
    
    npm.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    
    npm.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        console.log(`Dependencies installed for ${servicePath}`);
        resolve();
      } else {
        reject(new Error(`Failed to install dependencies for ${servicePath}`));
      }
    });
  });
};

// Function to start a service
const startService = (service) => {
  console.log(`Starting ${service.name}...`);
  
  const npm = spawn('npm', ['start'], {
    cwd: path.resolve(__dirname, service.path),
    shell: true
  });
  
  npm.stdout.on('data', (data) => {
    console.log(`[${service.name}] ${data}`);
  });
  
  npm.stderr.on('data', (data) => {
    console.error(`[${service.name}] ${data}`);
  });
  
  npm.on('close', (code) => {
    console.log(`${service.name} exited with code ${code}`);
  });
  
  return npm;
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