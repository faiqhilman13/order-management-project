import axios from 'axios';

const API_URL = 'http://localhost:5002/api/cart';

export const getCart = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(API_URL, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}; 