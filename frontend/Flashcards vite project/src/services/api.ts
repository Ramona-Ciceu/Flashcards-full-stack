// frontend/src/services/api.ts

const API_URL = 'http://localhost:3000';

export const getSets = async () => {
  const response = await fetch(`${API_URL}/sets`);
  if (!response.ok) {
    throw new Error('Failed to fetch sets');
  }
  return response.json();
};
