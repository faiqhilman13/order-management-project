import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Button, Alert } from 'react-bootstrap';
import { getOrder } from '../services/orderService';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!order) return <Alert variant="warning">Order not found</Alert>;

  return (
    <div>
      <h1 className="mb-4">Order Confirmation</h1>
      
      <div className="order-confirmation">
        <h4>Thank you for your order!</h4>
        <p>Your order has been placed successfully. Here are your order details:</p>
        
        <Card className="mb-4">
          <Card.Header>
            <strong>Order ID:</strong> {order._id}
          </Card.Header>
          <Card.Body>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
            
            <h5 className="mt-4">Order Items:</h5>
            <ListGroup>
              {order.items.map(item => (
                <ListGroup.Item key={item.productId}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{item.name}</strong> x {item.quantity}
                    </div>
                    <div>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            
            <div className="d-flex justify-content-end mt-3">
              <h4>Total: ${order.total.toFixed(2)}</h4>
            </div>
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-between">
          <Button as={Link} to="/" variant="outline-primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 