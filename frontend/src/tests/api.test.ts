import axios from 'axios';
import { describe, it, beforeAll, afterAll, expect, afterEach } from '@jest/globals';
import { fetchSets, createSet, fetchSetById, updateSet, deleteSet } from '../utils/api';  

// Mock the axios module
jest.mock('axios');

describe('API Calls', () => {

  afterEach(() => {
    jest.clearAllMocks();  // Clear mocks after each test
  });

  it('should fetch all sets', async () => {
    const mockResponse = [
      { id: 1, name: 'Flashcards Set 1' },
      { id: 2, name: 'Flashcards Set 2' },
    ];
    
    // Mock the axios GET request
    (axios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    // Call the fetchSets function
    const response = await fetchSets();

    // Assert the response
    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith('/set');
  });

  it('should create a new set', async () => {
    const newSet = { name: 'New Set' };
    const mockResponse = { id: 3, name: 'New Set' };

    // Mock the axios POST request
    (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    // Call the createSet function
    const response = await createSet(newSet);

    // Assert the response
    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith('/set', newSet);
  });

  it('should fetch a specific set by ID', async () => {
    const mockData = { id: 1, name: 'Flashcards Set 1' };

    // Mock the axios GET request
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    // Call the fetchSetById function
    const response = await fetchSetById(1);

    // Assert the response
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/set/1');
  });

  it('should update an existing set', async () => {
    const updatedData = { name: 'Updated Set', description: 'New description' };
    const mockResponse = { id: 1, name: 'Updated Set', description: 'New description' };

    // Mock the axios PUT request
    (axios.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    // Call the updateSet function
    const response = await updateSet(1, updatedData);

    // Assert the response
    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith('/set/1', updatedData);
  });

  it('should delete a set', async () => {
    const mockResponse = { message: 'Deleted successfully' };

    // Mock the axios DELETE request
    (axios.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

    // Call the deleteSet function
    const response = await deleteSet(1);

    // Assert the response
    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith('/set/1');
  });
});
