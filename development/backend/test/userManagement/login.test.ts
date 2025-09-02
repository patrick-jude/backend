import request from 'supertest';
import { app, initializeDatabase, closeDatabaseConnection } from '../../src/index.js';
import { User } from '../../src/data/data-sources/database.js';

const testUser = {
  username: 'login_user_test',
  password: 'LoginPassword123!',
  confirmPassword: 'LoginPassword123!',
  firstName: 'Login',
  lastName: 'Test',
  address: '202 Login St',
  gender: 'Female',
  dateOfBirth: new Date('2025-08-28T10:00:00Z'),
  email: 'login.test@example.com',
};

const loginUser = {
  username: testUser.username,
  password: testUser.password,
};

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  // Register a user before each login test
  await request(app).post('/api/auth/register').send(testUser);
});

afterEach(async () => {
  try {
    await User().destroy({ truncate: true, cascade: true });
    console.log('Login test: Database table cleared after test.');
  } catch (error) {
    console.error('Login test: Error clearing database after test:', error);
  }
});

afterAll(async () => {
  // Close the database connection after all tests in this file are done
  await closeDatabaseConnection();
  console.log('Register test: Database connection closed after all tests in this file.');
});

describe('Login Endpoint: POST /api/auth/login', () => {
  it('should login a user successfully and return tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(loginUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Login successful!');
    expect(res.body).toHaveProperty('accessToken');
    // expect(res.body).toHaveProperty('refreshToken');
    expect(typeof res.body.accessToken).toBe('string');
    // expect(typeof res.body.refreshToken).toBe('string');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  it('should return 401 for invalid username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nonexistent', password: 'AnyPassword123!' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials.');
  });

  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: 'WrongPassword!' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials.');
  });
});