import request from 'supertest';
import { app, initializeDatabase, closeDatabaseConnection } from '../../src/index.js';
import { User } from '../../src/data/data-sources/database.js';
import bcrypt from 'bcryptjs';


const testUser = {
  username: 'forgot_user_test',
  password: 'ForgotPassword123!',
  confirmPassword: 'ForgotPassword123!',
  firstName: 'Forgot',
  lastName: 'Test',
  address: '303 Forgot St',
  gender: 'Other',
  age: 35,
  email: 'forgot.test@example.com',
};

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await request(app).post('/api/auth/register').send(testUser);
});

afterEach(async () => {
  try {
    await User().destroy({ truncate: true, cascade: true });
    console.log('Forgot Password test: Database table cleared after test.');
  } catch (error) {
    console.error('Forgot Password test: Error clearing database after test:', error);
  }
});

afterAll(async () => {
  // Close the database connection after all tests in this file are done
  await closeDatabaseConnection();
  console.log('Register test: Database connection closed after all tests in this file.');
});

describe('Forgot Password Endpoint: POST /api/auth/forgot-password', () => {
  it('should allow password reset for an existing email', async () => {
    const newPassword = 'NewSecurePassword123!';
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: testUser.email,
        newPassword: newPassword,
        confirmNewPassword: newPassword,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Password reset initiated.');

    const userInDb = await User().findOne({ 
      where: { email: testUser.email },
      raw: true
    });
    expect(userInDb).not.toBeNull();
    expect(await bcrypt.compare(newPassword, userInDb!.passwordHash)).toBe(true);
  });

  it('should return 200 but not reset for non-existent email (security by obscurity)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'nonexistent@example.com',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('If an account with that email exists, a password reset link has been sent.');

    const userInDb = await User().findOne({ 
      where: { email: testUser.email },
      raw: true 
    });
    expect(userInDb).not.toBeNull();
    expect(await bcrypt.compare(testUser.password, userInDb!.passwordHash)).toBe(true);
  });

  it('should return 400 if new passwords do not match', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: testUser.email,
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'MismatchedPassword!',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('New passwords do not match.');
  });
});


