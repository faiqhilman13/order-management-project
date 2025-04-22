import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { addToCart } from '../services/cartService';

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <Card className="product-card">
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.price.toFixed(2)}</Card.Text>
        <Card.Text>{product.description}</Card.Text>
        <Button 
          variant="primary" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard; 