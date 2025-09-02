import request from 'supertest';
import { app, initializeDatabase, closeDatabaseConnection } from '../../src/index.js';
import { User } from '../../src/data/data-sources/database.js';
import bcrypt from 'bcryptjs';

const testUser = {
  username: 'register_user_test',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  firstName: 'Register',
  lastName: 'Test',
  address: '101 Register St',
  gender: 'Male',
  daeOfBirth: new Date (1997,10,19),
  email: 'register.test@example.com',
};

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  // Clean database before each test to ensure fresh state
  try {
    await User().destroy({ truncate: true, cascade: true });
    console.log('Register test: Database table cleared before test.');
  } catch (error) {
    console.error('Register test: Error clearing database before test:', error);
  }
});

afterAll(async () => {
  // Final cleanup and close connection
  try {
    await User().destroy({ truncate: true, cascade: true });
    console.log('Register test: Final database cleanup completed.');
  } catch (error) {
    console.error('Register test: Error in final cleanup:', error);
  }
  
  await closeDatabaseConnection();
  console.log('Register test: Database connection closed after all tests.');
});

describe('Register Endpoint: POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User registered successfully!');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username', testUser.username);
    expect(res.body.user).toHaveProperty('email', testUser.email);

    // Add a small delay to ensure database write is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use raw: true to get plain object
    const userInDb = await User().findOne({ 
      where: { username: testUser.username },
      raw: true  // This returns a plain object instead of Sequelize instance
    });
    
    console.log('Debug - Raw userInDb:', userInDb);
    
    expect(userInDb).not.toBeNull();
    expect(userInDb?.username).toEqual(testUser.username);
    expect(await bcrypt.compare(testUser.password, userInDb!.passwordHash)).toBe(true);
  });

  it('should return 400 if passwords do not match', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, confirmPassword: 'MismatchedPassword' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Passwords do not match.');
  });

  it('should return 400 if username already exists', async () => {
    // First registration
    const firstRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(firstRes.statusCode).toEqual(201);
    
    // Add delay to ensure first registration is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Attempt duplicate registration
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'another.email@example.com' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Username already taken.');
  });

  it('should return 400 if email already exists', async () => {
    // First registration
    const firstRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(firstRes.statusCode).toEqual(201);
    
    // Add delay to ensure first registration is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Attempt duplicate registration with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, username: 'anotheruser' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Email address already registered.');
  });
});