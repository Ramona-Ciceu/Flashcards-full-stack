// src/utils/api.test.tsx

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchSets, createSet, fetchSetById, updateSet, deleteSet, createCommentsBySetId } from '../utils/api'; 

describe('API Utility Functions', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  test('fetchSets should fetch all sets', async () => {
    const sets = [{ id: 1, name: 'Test Set' }];
    mock.onGet('/set').reply(200, sets);

    const data = await fetchSets();

    expect(data).toEqual(sets);
    expect(axios.get).toHaveBeenCalledWith('/set');
  });

  test('createSet should create a new set', async () => {
    const newSet = { name: 'New Set', userId: '123' };
    mock.onPost('/set').reply(201, newSet);

    const data = await createSet(newSet);

    expect(data).toEqual(newSet);
    expect(axios.post).toHaveBeenCalledWith('/set', newSet, { headers: { "Content-Type": "application/json" } });
  });

  test('fetchSetById should fetch a set by ID', async () => {
    const set = { id: 1, name: 'Test Set' };
    mock.onGet('/set/1').reply(200, { data: set });

    const data = await fetchSetById(1);

    expect(data).toEqual(set);
    expect(axios.get).toHaveBeenCalledWith('/set/1');
  });

  test('updateSet should update an existing set', async () => {
    const updates = { name: 'Updated Set' };
    mock.onPut('/set/1').reply(200, updates);

    const data = await updateSet(1, updates);

    expect(data).toEqual(updates);
    expect(axios.put).toHaveBeenCalledWith('/set/1', updates, { headers: { "Content-Type": "application/json" } });
  });

  test('deleteSet should delete a set', async () => {
    mock.onDelete('/set/1').reply(204);

    await deleteSet(1);

    expect(axios.delete).toHaveBeenCalledWith('/set/1');
  });

  test('createCommentsBySetId should create a comment', async () => {
    const comment = { rating: 5, comments: 'Great set!', userId: 123 };
    mock.onPost('/set/1/comments').reply(201, comment);

    const data = await createCommentsBySetId(1, comment.rating, comment.comments, comment.userId);

    expect(data).toEqual(comment);
    expect(axios.post).toHaveBeenCalledWith('/set/1/comments', comment, { headers: { "Content-Type": "application/json" } });
  });

  test('fetchSets should handle errors', async () => {
    mock.onGet('/set').reply(500);

    await expect(fetchSets()).rejects.toThrow('Request failed with status code 500');
  });

  test('createSet should handle errors', async () => {
    mock.onPost('/set').reply(400, { error: 'Invalid data' });

    await expect(createSet({ name: '', userId: '' })).rejects.toThrow('Invalid data');
  });

  test('fetchSetById should handle errors', async () => {
    mock.onGet('/set/1').reply(404, { error: 'Set not found' });

    await expect(fetchSetById(1)).rejects.toThrow('Set not found');
  });

  test('updateSet should handle errors', async () => {
    mock.onPut('/set/1').reply(400, { error: 'Invalid data' });

    await expect(updateSet(1, { name: '' })).rejects.toThrow('Invalid data');
  });

  test('deleteSet should handle errors', async () => {
    mock.onDelete('/set/1').reply(404, { error: 'Set not found' });

    await expect(deleteSet(1)).rejects.toThrow('Set not found');
  });

  test('createCommentsBySetId should handle errors', async () => {
    mock.onPost('/set/1/comments').reply(400, { error: 'Invalid input' });

    await expect(createCommentsBySetId(1, 5, '', 123)).rejects.toThrow('Invalid input');
  });
});
