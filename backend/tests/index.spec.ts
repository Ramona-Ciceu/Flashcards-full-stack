import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';
import supertest from 'supertest';

import app from '../src/index';
import { describe, test, beforeAll, afterAll, expect } from '@jest/globals';

const prisma = new PrismaClient();
jest.mock('@prisma/client');

jest.mock('@prisma/client', () => {
  const originalModule = jest.requireActual('@prisma/client');
  return {
    ...originalModule,
    PrismaClient: jest.fn(() => ({
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn().mockResolvedValue({
          id: 1,
          username: 'testuser',
          role: 'user'
        }),
      },
      update: jest.fn().mockRejectedValue(new Error('User not found')),
    })),
    collection: {
      findUnique: jest.fn(),
    },
    set: {
      findUnique: jest.fn(),
    }
  };
});


describe("POST /login", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    password: "password123",
    
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and user data for valid credentials", async () => {
    // Mock `findFirst` to return a user for valid credentials
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: mockUser.id,
      username: mockUser.username,
      password: mockUser.password,
    });

    const response = await request(app)
      .post("/login")
      .send({ username: mockUser.username, password: mockUser.password })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: mockUser.id, username: mockUser.username });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { username: mockUser.username },
    });
  });

  it("should return 401 for invalid credentials", async () => {
    // Mock Prisma response for invalid user
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: mockUser.id,
      username: mockUser.username,
      password: "wrongpassword",
    });

    const response = await request(app)
      .post("/login")
      .send({ username: mockUser.username, password: "wrongpassword" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { username: mockUser.username },
    });
  });

  it("should return 401 if user is not found", async () => {
    // Mock Prisma response for no user found
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ username: "nonexistentuser", password: "password" })
      .set("Content-Type", "application/json");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });
  });

  it("should return 500 for server errors", async () => {
    // Mock Prisma response to throw an error
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error logging in." });
  });



describe('PUT /set/:id', () => {
   test('should return 400 if no fields are provided to update', async () => {
    const response = await request(app).put('/set/1').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No fields to update');
  });
});

describe('DELETE /set/:id', () => {
  test('error deleting user', async () => {
    const response = await request(app).delete('/set/1');  // Assuming a set with ID 1 exists

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error deleting user');
  });



describe('GET /set/:id/flashcard', () => {
   test('should return 400 for invalid set ID', async () => {
    const response = await request(app).get('/set/invalidId/flashcard');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid set ID');
  });
});




/// Testing for user
describe('User API Routes', () => {

  beforeAll(async () => {
    // Set up test data if needed
  });

  afterAll(async () => {
    // Clean up test data if needed
  });
describe('GET /', () => {
  test('should return active API version for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The active API version');
  });


  // Test POST create a user
  describe('POST /user', () => {
    const mockUser = {
      username: 'testuser',
      password: 'securepassword',
      role: 'user',
    };

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });

       test('should return 400 if the user cannot be created', async () => {
      const mockError = new Error('User creation failed');

        // Mocking the create method from Prisma
        (prisma.user.create as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .post('/user')
        .send(mockUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(mockError.message);
    });
  });

  // Test GET a user by ID
  describe('GET /user/:id', () => {
  
    test('should return 400 for invalid user ID', async () => {
      const response = await request(app).get('/user/invalidId');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });
  });

  // Test PUT update a user by ID
  describe('PUT /user/:id', () => {
       test('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .put('/user/invalidId')
        .send({ username: 'updatedUser' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });
  });

  // Test DELETE a user by ID
  describe('DELETE /user/:id', () => {
       test('should return 400 for invalid user ID', async () => {
      const response = await request(app).delete('/user/invalidId');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });
  });
 

describe('User Routes Error Handling', () => {
  
  describe('GET /user/:id', () => {
    it('should return 400 for an invalid user ID', async () => {
      const response = await request(app).get('/user/abc');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).get('/user/999'); // Assuming 999 is a non-existing user ID
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('The user not found');
    });

    it('should return 500 on server error', async () => {
      // Mock server error scenario
      jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Suppress console errors for test clarity
      const response = await request(app).get('/user/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('An error occurred while fetching the user.');
    });
  });

  describe('PUT /user/:id', () => {
    it('should return 400 for an invalid user ID', async () => {
      const response = await request(app).put('/user/abc').send({ username: 'newname' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });

    it('should return 403 if user role change not allowed', async () => {
      const response = await request(app).put('/user/1').send({ role: 'admin' }).set('x-role', 'user'); // Assuming user is not admin
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Not authorized to change user role.');
    });

  describe('DELETE /user/:id', () => {
    it('should return 400 for an invalid user ID', async () => {
      const response = await request(app).delete('/user/abc');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).delete('/user/999'); // Assuming 999 is a non-existing user ID
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Suppress console errors for test clarity
      const response = await request(app).delete('/user/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error deleting user');
    });
  });

  describe('GET /user/:userId/set', () => {
    it('should return 400 for an invalid user ID', async () => {
      const response = await request(app).get('/user/abc/set');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid user ID');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).get('/user/999/set'); // Assuming 999 is a non-existing user ID
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Suppress console errors for test clarity
      const response = await request(app).get('/user/1/set');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('An error occurred while fetching the flashcard sets');
    });
  });

});
});
describe('GET /user/:userId/collection', () => {
  it('should return 400 for an invalid user ID', async () => {
    const response = await request(app).get('/user/abc/collection');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user ID');
  });

  it('should return 404 if user or set not found', async () => {
    const response = await request(app).get('/user/999/collection'); // Assuming 999 is a non-existing user ID
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User or set not found');
  });

  it('should return 500 on server error', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Suppress console errors for test clarity
    const response = await request(app).get('/user/1/collection');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('An error occurred while fetching the flashcard collection.');
  });
});
});
});
});


