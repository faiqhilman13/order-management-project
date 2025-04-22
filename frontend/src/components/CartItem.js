import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { updateCartItem, removeFromCart } from '../services/cartService';

const CartItem = ({ item, onUpdate }) => {
  const handleQuantityChange = async (newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(item.productId);
      } else {
        await updateCartItem(item.productId, newQuantity);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    }
  };

  return (
    <div className="cart-item">
      <Row>
        <Col md={6}>
          <h5>{item.name}</h5>
          <p>${item.price.toFixed(2)} each</p>
        </Col>
        <Col md={3}>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </Button>
            <span className="mx-2">{item.quantity}</span>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </Button>
          </div>
        </Col>
        <Col md={2}>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </Col>
        <Col md={1}>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleQuantityChange(0)}
          >
            X
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CartItem; 