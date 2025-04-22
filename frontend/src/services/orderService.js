import axios from 'axios';

const API_URL = 'http://localhost:5003/api/orders';

export const getOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (shippingAddress) => {
  try {
    const response = await axios.post(API_URL, { shippingAddress });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw error;
  }
}; 