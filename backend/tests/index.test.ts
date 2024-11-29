import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';
import app from '../src/index'; 

const prisma = new PrismaClient();

describe('API Routes', () => {

  // Test health check
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

  // Test GET a specific set
  it('should return a flashcard set by ID for GET /set/:id', async () => {
    const setId = 1; // Make sure the set exists in your DB
    const response = await request(app).get(`/set/${setId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(setId);
  });

  // Test POST comment on a set
  it('should post a comment for POST /set/:id/comments', async () => {
    const response = await request(app)
      .post('/set/1/comments')  // Make sure set ID 1 exists
      .send({
        userId: 1,  // Assuming the user with id 1 exists
        rating: 5,
        comments: 'Great set!',
      });
    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(5);
    expect(response.body.comments).toBe('Great set!');
  });

  // Test POST create user
  it('should create a new user for POST /user', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        username: 'newuser',
        password: 'password123',
        email: 'newuser@example.com',
        role: 'user',
        firstName: 'New',
        lastName: 'User',
      });
    expect(response.status).toBe(201);
    expect(response.body.username).toBe('newuser');
  });

  // Test GET a user by ID
  it('should return a user by ID for GET /user/:id', async () => {
    const userId = 1; // Make sure the user with id 1 exists
    const response = await request(app).get(`/user/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  // Test POST create flashcard (with valid data)
  it('should create a flashcard for POST /flashcards', async () => {
    const response = await request(app)
      .post('/flashcards')
      .send({
        setId: 1,  // Assuming a set with ID 1 exists
        question: 'What is 2 + 2?',
        solution: '4',
        difficulty: 'easy',
      });
    expect(response.status).toBe(201);
    expect(response.body.question).toBe('What is 2 + 2?');
    expect(response.body.difficulty).toBe('easy');
  });

  // Test validation middleware for POST /set with missing required field
  it('should return 400 for POST /set with missing exampleField', async () => {
    const response = await request(app)
      .post('/set')
      .send({ name: 'Invalid Set' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('exampleField is required');
  });

  // Test error handling (user not found)
  it('should return 404 for GET /set/:id with invalid ID', async () => {
    const response = await request(app).get('/set/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Error fetching sets. ');
  });

});

