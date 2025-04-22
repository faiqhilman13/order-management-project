import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h1 className="mb-4">Products</h1>
      <Row>
        {products.length === 0 ? (
          <Col>No products available</Col>
        ) : (
          products.map(product => (
            <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default ProductList; 