import request from 'supertest';
import initializeApp from '../src/app';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import { Exercise } from '../src/entity/Exercise';

import { Server } from 'http'; // Import Server type

let adminToken: string;
let server: Server;

describe('Integration Tests', () => {
  let userRepository: any;
  let exerciseRepository: any;

  beforeAll(async () => {
    console.log('Integration Test Setup: Initializing TypeORM Data Source...');
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    userRepository = AppDataSource.getRepository(User);
    exerciseRepository = AppDataSource.getRepository(Exercise);
    console.log('Integration Test Setup: TypeORM Data Source initialized.');

    // Clear existing data for a clean test run
    await userRepository.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;');
    await exerciseRepository.query('TRUNCATE TABLE exercise RESTART IDENTITY CASCADE;');

    // Initialize the app
    const testApp = initializeApp();

    // Start the server and store the instance
    server = testApp.listen(0);
    await new Promise<void>((resolve) => {
      server.on('listening', () => {
        const address = server.address();
        console.log(
          `Integration Test Setup: Test server listening on port ${
            typeof address === 'string' ? address : address?.port
          }`
        );
        resolve();
      });
    });

    // Register and log in an admin user for all tests to get a token
    const adminUserData = {
      email: 'globaladmin@example.com',
      password: 'a-very-secure-password-for-admin',
      role: 'admin',
    };

    await request(server).post('/auth/register').send(adminUserData);
    const loginResponse = await request(server).post('/auth/login').send({ email: adminUserData.email, password: adminUserData.password });
    adminToken = loginResponse.body.token;
  });

  afterAll(async () => {
    console.log('Integration Test Teardown: Closing server and data source.');
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            console.error('Error closing server:', err);
            return reject(err);
          }
          console.log('Integration Test Teardown: Server closed.');
          resolve();
        });
      });
    }
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Integration Test Teardown: Data Source destroyed.');
    }
  });

  test('GET / should return welcome message', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to the CrossFit Workout Generator API!');
  });

  describe('Auth API', () => {
    test('POST /auth/register should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      };

      const response = await request(server).post('/auth/register').send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).not.toHaveProperty('password_hash');

      // Verify user exists in the database
      const userInDb = await userRepository.findOneBy({ email: userData.email });
      expect(userInDb).not.toBeNull();

      expect(userInDb!.email).toBe(userData.email);
      expect(userInDb).toHaveProperty('password'); // password is the field name in TypeORM entity
    });

    // Test for user login
    test('POST /auth/login should log in an existing user and return a token', async () => {
      const userData = {
        email: 'login@example.com',
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      };

      // Register the user first
      await request(server).post('/auth/register').send(userData);

      const response = await request(server)
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    // Test for getting current user data
    test('GET /users/me should return user data for authenticated user', async () => {
      const userData = {
        email: 'protected@example.com',
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      };

      // Register and log in the user to get a token
      await request(server).post('/auth/register').send(userData);
      const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password });

      const token = loginResponse.body.token;

      const response = await request(server).get('/users/me').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');

      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password_hash');
    });

    // Test for no token provided
    test('GET /users/me should return 401 if no token is provided', async () => {
      const response = await request(server).get('/users/me');
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    // Test for invalid token provided
    test('GET /users/me should return 401 if invalid token is provided', async () => {
      const invalidToken = 'invalid.jwt.token';
      const response = await request(server).get('/users/me').set('Authorization', `Bearer ${invalidToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('Exercise API', () => {
    // Group tests that depend on a created exercise
    describe('operations on a single exercise', () => {
      let createdExerciseId: number;

      // 1. Add a test to confirm the initial state is clean.
      // If this test fails, you know the DB cleanup in `beforeAll` is the problem.
      test('GET /exercises should return an empty list initially', async () => {
        const response = await request(server)
          .get('/exercises')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
      });

      // The first test creates the resource.
      test('POST /exercises should create a new exercise', async () => {
        const exerciseData = {
          name: 'Test Exercise',
          description: 'A test exercise for integration testing',
          type: 'Strength',
          muscle_group: 'Chest',
          difficulty: 'Intermediate',
          equipment: 'Barbell',
        };

        const response = await request(server)
          .post('/exercises')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(exerciseData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(exerciseData.name);
        createdExerciseId = response.body.id; // Assign ID for subsequent tests

        // Verify exercise exists in the database
        const exerciseInDb = await exerciseRepository.findOneBy({ id: createdExerciseId });
        expect(exerciseInDb).not.toBeNull();
        expect(exerciseInDb!.name).toBe(exerciseData.name);
        expect(exerciseInDb!.muscle_group).toBe(exerciseData.muscle_group);
        expect(exerciseInDb!.difficulty).toBe(exerciseData.difficulty);
      });

      // 2. Add a test to confirm the resource was added to the list.
      test('GET /exercises should return a list with the created exercise', async () => {
        const response = await request(server)
          .get('/exercises')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Test Exercise');
      });

      // Subsequent tests use the 'createdExerciseId' from the test above.
      // Jest runs tests in a describe block serially, so this is safe.
      test('GET /exercises/:id should return the created exercise', async () => {
        const response = await request(server)
          .get(`/exercises/${createdExerciseId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', createdExerciseId);
        expect(response.body).toHaveProperty('name', 'Test Exercise');
      });

      test('PUT /exercises/:id should update the created exercise', async () => {
        const updatedExerciseData = {
          name: 'Updated Test Exercise',
          description: 'Updated description',
        };

        const response = await request(server)
          .put(`/exercises/${createdExerciseId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updatedExerciseData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Exercise updated successfully');

        const exerciseInDb = await exerciseRepository.findOneBy({ id: createdExerciseId });
        expect(exerciseInDb).not.toBeNull();
        expect(exerciseInDb!.name).toBe(updatedExerciseData.name);
        expect(exerciseInDb!.description).toBe(updatedExerciseData.description);
      });

      test('DELETE /exercises/:id should delete the created exercise', async () => {
        const response = await request(server)
          .delete(`/exercises/${createdExerciseId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Exercise deleted successfully');

        const exerciseInDb = await exerciseRepository.findOneBy({ id: createdExerciseId });
        expect(exerciseInDb).toBeNull();
      });
    });

    test('POST /exercises should return 409 if exercise name already exists', async () => {
      const exerciseData = {
        name: 'Duplicate Exercise Test',
        description: 'An exercise to test duplicate creation.',
        type: 'Cardio',
        difficulty: 'Beginner',
        equipment: 'Treadmill',
      };

      // 1. Create the exercise successfully the first time.
      const createResponse = await request(server)
        .post('/exercises')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(exerciseData);

      expect(createResponse.statusCode).toBe(201);

      // 2. Attempt to create it again with the same name.
      const duplicateResponse = await request(server)
        .post('/exercises')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(exerciseData);

      // 3. Assert that the server returns a 409 Conflict error.
      expect(duplicateResponse.statusCode).toBe(409);
      expect(duplicateResponse.body).toHaveProperty('message', 'An exercise with this name already exists.');
    });
  });
});
