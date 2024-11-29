import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';
import app from '../src/index';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';

const prisma = new PrismaClient();

describe('Set API Routes', () => {

  beforeAll(async () => {
    // Set up test data if needed
  });

  afterAll(async () => {
    // Clean up test data if needed
  });

  it('should return active API version for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The active API version');
  });

  // Test GET all sets
  it('should return all flashcard sets for GET /set', async () => {
    const response = await request(app).get('/set');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test POST create a set
  it('should create a new flashcard set for POST /set', async () => {
    const response = await request(app)
      .post('/set')
      .send({
        name: 'New Set',
        description: 'Test description',
        userId: 1, // Assuming you have a user with id 1 in your DB
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Set');
    expect(response.body.description).toBe('Test description');
  });

});

describe('PUT /set/:id', () => {
  it('should update a flashcard set by ID', async () => {
    const updatedSet = { name: 'Updated Set', description: 'Updated description' };

    const response = await request(app)
      .put('/set/1')  // Assuming a set with ID 1 exists
      .send(updatedSet);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedSet.name);
    expect(response.body.description).toBe(updatedSet.description);
  });

  it('should return 400 for invalid ID', async () => {
    const response = await request(app).put('/set/invalidId').send({
      name: 'Invalid Set',
      description: 'Test description',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid id parameter');
  });

  it('should return 400 if no fields are provided to update', async () => {
    const response = await request(app).put('/set/1').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No fields to update');
  });
});

describe('DELETE /set/:id', () => {
  it('should delete a flashcard set by ID', async () => {
    const response = await request(app).delete('/set/1');  // Assuming a set with ID 1 exists

    expect(response.status).toBe(204);
    expect(response.body.message).toBe('The flashcard set was deleted');
  });

  it('should return 404 if the set is not found', async () => {
    const response = await request(app).delete('/set/999');  // Assuming set with ID 999 does not exist

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('The flashcard set was not found');
  });
});

describe('POST /set/:id/comments', () => {
  it('should create a comment for a flashcard set', async () => {
    const commentData = { userId: 1, rating: 5, comments: 'Great set!' };

    const response = await request(app)
      .post('/set/1/comments')  // Assuming a set with ID 1 exists
      .send(commentData);

    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(commentData.rating);
    expect(response.body.comments).toBe(commentData.comments);
  });

  it('should return 400 if the rating is invalid', async () => {
    const response = await request(app)
      .post('/set/1/comments')
      .send({ userId: 1, rating: 10, comments: 'Great set!' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Rating must be between 1 and 5');
  });

  it('should return 404 if the set does not exist', async () => {
    const response = await request(app)
      .post('/set/999/comments')
      .send({ userId: 1, rating: 5, comments: 'Great set!' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('The flashcard set was not found');
  });
});

describe('GET /set/:id/flashcard', () => {
  it('should retrieve flashcards from a set', async () => {
    const response = await request(app).get('/set/1/flashcard');  // Assuming a set with ID 1 exists

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 404 if no flashcards are found', async () => {
    const response = await request(app).get('/set/999/flashcard');  // Assuming no flashcards exist for set ID 999

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No flashcards found for the set');
  });

  it('should return 400 for invalid set ID', async () => {
    const response = await request(app).get('/set/invalidId/flashcard');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid set ID');
  });
});

describe('POST /flashcards', () => {
  it('should create a flashcard', async () => {
    const flashcardData = {
      setId: 1, // Assuming a set with ID 1 exists
      question: 'What is 2 + 2?',
      solution: '4',
      difficulty: 'easy',
    };

    const response = await request(app).post('/flashcards').send(flashcardData);

    expect(response.status).toBe(201);
    expect(response.body.question).toBe(flashcardData.question);
    expect(response.body.difficulty).toBe(flashcardData.difficulty);
  });

  it('should return 400 for invalid difficulty', async () => {
    const flashcardData = {
      setId: 1,
      question: 'What is 2 + 2?',
      solution: '4',
      difficulty: 'unknown',  // Invalid difficulty
    };

    const response = await request(app).post('/flashcards').send(flashcardData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid difficulty. Valid values are "easy", "medium", "hard".');
  });

  it('should return 404 if the set is not found', async () => {
    const flashcardData = {
      setId: 999,  // Assuming set ID 999 does not exist
      question: 'What is the capital of France?',
      solution: 'Paris',
      difficulty: 'easy',
    };

    const response = await request(app).post('/flashcards').send(flashcardData);

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

  it('should return active API version for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The active API version');
  });

  // Test GET all user
  it('should return all flashcard sets for GET /user', async () => {
    const response = await request(app).get('/user');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test POST create a user
  it('should create a new flashcard set for POST /user', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        username: 'test',
	    role: 'admin',
	
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('test');
    expect(response.body.description).toBe('Test description');
  });

  

});

  


