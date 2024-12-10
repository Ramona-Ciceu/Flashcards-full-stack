import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';

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
        delete: jest.fn().mockResolvedValue({
          id: 1,
          username: 'testuser',
          role: 'user'
        }),
      },
      update: jest.fn().mockRejectedValue(new Error('User not found')),
    })),
  };
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

describe('POST /set/:id/flashcard', () => {
 
  test('should return 400 for invalid difficulty', async () => {
    const flashcardData = {
      setId: 1,
      question: 'What is 2 + 2?',
      solution: '4',
      difficulty: 'unknown',  // Invalid difficulty
    };
    const response = await request(app).post('/set/:id/flashcard').send(flashcardData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid difficulty. Valid values are "easy", "medium", "hard".');
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
});
})})})


