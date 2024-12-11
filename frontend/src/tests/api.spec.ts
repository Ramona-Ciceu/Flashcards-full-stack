// src/utils/api.test.tsx

import MockAdapter from 'axios-mock-adapter';
import {getAllFlashcardCollections, updateFlashcardCollection,createFlashcardCollection, addSetToCollection, getFlashcardCollectionById, getFlashcardCollectionsByUser,updateUser, createUser,fetchUserById, fetchUser,loginUser,fetchSets, createSet, fetchSetById, updateSet, deleteSet, createCommentsBySetId } from '../utils/api'; 

describe('API Utility Functions', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('fetchSets should fetch all sets', async () => {
    const sets = [{ id: 1, name: 'Test Set', userId:4 }];
    // mock.onGet('/set').reply(200, sets);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: sets })
      })
    ) as jest.Mock;

    const data = await fetchSets();

    expect(data).toEqual({ data: sets});
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/set", {
      method: "GET"
    })
  });

  test('createSet should create a new set', async () => {
    const newSet = { name: 'New Set', userId: '123' };
  //     mock.onPost('/set').reply(201, newSet);
  
      global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
       json: () => Promise.resolve({ data: newSet })
     })
    ) as jest.Mock;

    const data = await createSet(newSet);

      expect(data).toEqual({data: newSet});
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/set", {
        method: "POST"
      }) 
     });
     test('updateSet should update an existing set', async () => {
      const updates = { id: 24, name: 'Updated Set' };
    
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(updates), // Mock the exact expected response
        })
      ) as jest.Mock;
    
      const data = await updateSet(24, updates);
    
      expect(data).toEqual(updates);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/set/24', {
        method: 'PUT', // Correct method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    });
    

test('deleteSet should delete a set', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 204,
    })
  ) as jest.Mock;

  await deleteSet(1);

  expect(fetch).toHaveBeenCalledWith("http://localhost:3000/set/1", {
    method: "DELETE",
  });
});

test('fetchSets should handle errors', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Request failed with status 500' }),
    })
  ) as jest.Mock;

  await expect(fetchSets()).rejects.toThrow('Request failed with status 500');
});


test('createSet should handle errors', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Invalid data' }),
    })
  ) as jest.Mock;

  await expect(createSet({ name: '', userId: '' })).rejects.toThrow('Invalid data');
});

test('fetchSetById should handle errors', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Set not found' }),
    })
  ) as jest.Mock;

  await expect(fetchSetById(1)).rejects.toThrow('Set not found');
});

test('updateSet should update an existing set', async () => {
  const updates = { id: 1, name: 'Updated Set' };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(updates), // Mock response without a wrapper
    })
  ) as jest.Mock;

  const data = await updateSet(1, updates);

  expect(data).toEqual(updates);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/set/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }, // Ensure headers are checked
    body: JSON.stringify(updates),
  });
});


test('deleteSet should handle errors', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Set not found' }),
    })
  ) as jest.Mock;

  await expect(deleteSet(1)).rejects.toThrow('Set not found');
});
})
test('loginUser should log in the user with valid credentials', async () => {
  const userCredentials = { username: 'testuser', password: 'password123' };
  const mockResponse = { token: 'fake-jwt-token', user: { id: 1, username: 'testuser' } };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await loginUser(userCredentials.username, userCredentials.password);

  expect(data).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userCredentials),
  });
});

test('loginUser should throw an error with invalid credentials', async () => {
  const userCredentials = { username: 'testuser', password: 'wrongpassword' };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
    })
  ) as jest.Mock;

  await expect(loginUser(userCredentials.username, userCredentials.password)).rejects.toThrow(
    'Invalid username or password'
  );
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userCredentials),
  });
});
test('fetchUser should retrieve the current user', async () => {
  const mockResponse = { data: { id: 1, username: 'testuser' } };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await fetchUser();

  expect(data).toEqual(mockResponse.data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user', { method: 'GET' });
});
test('fetchUserById should retrieve user details by ID', async () => {
  const mockResponse = { data: { id: 1, username: 'testuser' } };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await fetchUserById(1);

  expect(data).toEqual(mockResponse.data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user/1', { method: 'GET' });
});
test('createUser should create a new user', async () => {
  const newUser = { username: 'newuser', password: 'password123', role: 'user' };
  const mockResponse = { id: 1, ...newUser };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await createUser(newUser);

  expect(data).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newUser),
  });
});
test('updateUser should update an existing user', async () => {
  const updates = { username: 'updateduser' };
  const mockResponse = { data: { id: 1, ...updates } };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await updateUser(1, updates);

  expect(data).toEqual(mockResponse.data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user/1', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
});
test('getFlashcardCollectionsByUser should fetch collections for a specific user', async () => {
  const mockResponse = { data: [{ id: 1, title: 'Collection 1' }, { id: 2, title: 'Collection 2' }] };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await getFlashcardCollectionsByUser(1);

  expect(data).toEqual(mockResponse.data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user/1/collection', { method: 'GET' });
});
test('getFlashcardCollectionById should fetch a specific collection by user and collection ID', async () => {
  const mockResponse = { data: { id: 1, title: 'Collection 1' } };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await getFlashcardCollectionById(1, 1);

  expect(data).toEqual(mockResponse.data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/user/1/collection/1', { method: 'GET' });
});

test('addSetToCollection should add a set to a collection', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
    })
  ) as jest.Mock;

  await addSetToCollection(1, 2);

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/collections/1/sets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ setId: 2 }),
  });
});

test('createFlashcardCollection should create a new collection', async () => {
  const newCollection = { title: 'New Collection', userId: 1, comment: 'Sample comment' };
  const mockResponse = { id: 1, ...newCollection };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await createFlashcardCollection(newCollection);

  expect(data).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCollection),
  });
});
test('updateFlashcardCollection should update an existing collection', async () => {
  const updates = { title: 'Updated Title', comment: 'Updated Comment' };
  const mockResponse = { id: 1, ...updates };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await updateFlashcardCollection(1, updates);

  expect(data).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/collection/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
});
test('getAllFlashcardCollections should fetch all collections', async () => {
  const mockResponse = { data: [{ id: 1, title: 'Collection 1' }, { id: 2, title: 'Collection 2' }] };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as jest.Mock;

  const data = await getAllFlashcardCollections();

  expect(data).toEqual(mockResponse.data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/collection', { method: 'GET' });
});