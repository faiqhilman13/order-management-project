import axios from 'axios';

const API_URL = 'http://localhost:5001/api/products';

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const seedProducts = async () => {
  try {
    const response = await axios.post(`${API_URL}/seed`);
    return response.data;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}; 