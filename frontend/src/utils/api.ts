import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend URL
});

export const fetchSet = async () => {
  const response = await api.get('/set');
  return response.data;
};

export const createSet = async (data: { name: string; description: string; userId: number }) => {
  const response = await api.post('/set', data);
  return response.data;
};

// Additional methods for fetching users, comments, etc.
export const fetchSetById = async (id: number) => {
  const response = await api.get(`/set/${id}`);
  return response.data;
};

export default api;
