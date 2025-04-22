import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import OrderConfirmation from './pages/OrderConfirmation';

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

export default App; 