import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';

import app from '../src/index';
import { describe, test, beforeAll, afterAll, expect } from '@jest/globals';


const prisma = new PrismaClient();
jest.mock('@prisma/client');

describe('Set API Routes', () => {

  test('should return active API version for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The active API version');
  });

  // Test GET all sets
  test('should return all flashcard sets for GET /set', async () => {
    const response = await request(app).get('/set');
    console.log('Response status:', response.status)
    console.log('Response body:', response.body)
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test POST create a set
  test('should create a new flashcard set for POST /set', async () => {
    const response = await request(app)
      .post('/set')
      .send({
        name: 'New Set',
        userId: 1,
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Set');

  });

});

describe('PUT /set/:id', () => {
  test('should update a flashcard set by ID', async () => {
    const updatedSet = { name: 'Updated Set', description: 'Updated description' };

    const response = await request(app)
      .put('/set/1')  // Assuming a set with ID 1 exists
      .send(updatedSet);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedSet.name);
 
  });

  test('should return 400 for invalid ID', async () => {
    const response = await request(app).put('/set/invalidId').send({
      name: 'Invalid Set',

    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid id parameter');
  });

  test('should return 400 if no fields are provided to update', async () => {
    const response = await request(app).put('/set/1').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No fields to update');
  });
});

describe('DELETE /set/:id', () => {
  test('should delete a flashcard set by ID', async () => {
    const response = await request(app).delete('/set/1');  // Assuming a set with ID 1 exists

    expect(response.status).toBe(204);
    expect(response.body.message).toBe('The flashcard set was deleted');
  });

  test('should return 404 if the set is not found', async () => {
    const response = await request(app).delete('/set/999');  // Assuming set with ID 999 does not exist

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('The flashcard set was not found');
  });
});

describe('POST /set/:id/comments', () => {
  test('should create a comment for a flashcard set', async () => {
    const commentData = { userId: 1, rating: 5, comments: 'Great set!' };

    const response = await request(app)
      .post('/set/1/comments')  // Assuming a set with ID 1 exists
      .send(commentData);

    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(commentData.rating);
    expect(response.body.comments).toBe(commentData.comments);
  });

  test('should return 400 if the rating is invalid', async () => {
    const response = await request(app)
      .post('/set/1/comments')
      .send({ userId: 1, rating: 10, comments: 'Great set!' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Rating must be between 1 and 5');
  });

  test('should return 404 if the set does not exist', async () => {
    const response = await request(app)
      .post('/set/999/comments')
      .send({ userId: 1, rating: 5, comments: 'Great set!' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('The flashcard set was not found');
  });
});

describe('GET /set/:id/flashcard', () => {
  test('should retrieve flashcards from a set', async () => {
    const response = await request(app).get('/set/1/flashcard');  // Assuming a set with ID 1 exists

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should return 404 if no flashcards are found', async () => {
    const response = await request(app).get('/set/999/flashcard');  // Assuming no flashcards exist for set ID 999

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No flashcards found for the set');
  });

  test('should return 400 for invalid set ID', async () => {
    const response = await request(app).get('/set/invalidId/flashcard');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid set ID');
  });
});

describe('POST /set/:id/flashcard', () => {
  test('should create a flashcard', async () => {
    const flashcardData = {
      setId: 1, // Assuming a set with ID 1 exists
      question: 'What is 2 + 2?',
      solution: '4',
      difficulty: 'easy',
    };

    const response = await request(app).post('/set/:id/flashcard').send(flashcardData);

    expect(response.status).toBe(201);
    expect(response.body.question).toBe(flashcardData.question);
    expect(response.body.difficulty).toBe(flashcardData.difficulty);
  });

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

  test('should return 404 if the set is not found', async () => {
    const flashcardData = {
      setId: 999,  // Assuming set ID 999 does not exist
      question: 'What is the capital of France?',
      solution: 'Paris',
      difficulty: 'easy',
    };

    const response = await request(app).post('/set/:id/flashcard').send(flashcardData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Set not found');
  });
});


  ///Testing for user
describe('User API Routes', () => {

  beforeAll(async () => {
    // Set up test data if needed
  });

  afterAll(async () => {
    // Clean up test data if needed
  });

  test('should return active API version for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The active API version');
  });

  // Test GET all user
  test('should return all flashcard sets for GET /user', async () => {
    const response = await request(app).get('/user');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
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

    test('should create a user successfully when valid input is provided', async () => {
        // Mock Prisma user creation
        (prisma.user.create as jest.Mock).mockResolvedValue({
            id: 1,
            ...mockUser,
        });

        const response = await request(app)
            .post('/user')
            .send(mockUser)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining(mockUser));
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: mockUser,
        });
    });

    test('should return 400 if the user cannot be created', async () => {
        // Mock Prisma throwing an error
        (prisma.user.create as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/user')
            .send(mockUser)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'The user could not be created.',
        });
    });

    test('should return 400 if required fields are missing', async () => {
        const invalidUser = { username: 'testuser' }; // Missing password and role

        const response = await request(app)
            .post('/user')
            .send(invalidUser)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
});


  


