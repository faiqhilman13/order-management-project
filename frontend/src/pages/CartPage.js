import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { getCart, clearCart } from '../services/cartService';
import { createOrder } from '../services/orderService';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleClearCart = async () => {
    try {
      await clearCart();
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!cart || cart.items.length === 0) {
        alert('Cannot place order with empty cart');
        return;
      }
      
      const order = await createOrder();
      navigate(`/order/${order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h1 className="mb-4">Your Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <Alert variant="info">Your cart is empty</Alert>
      ) : (
        <>
          {cart.items.map(item => (
            <CartItem 
              key={item.productId} 
              item={item} 
              onUpdate={fetchCart}
            />
          ))}
          
          <Card className="mt-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h4>Total: ${cart.total.toFixed(2)}</h4>
                </Col>
                <Col md={6} className="d-flex justify-content-end">
                  <Button 
                    variant="outline-danger" 
                    className="me-2"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    variant="success"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default CartPage; 