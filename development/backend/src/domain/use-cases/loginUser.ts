// Logic for user login.

import { UserRepository } from '../repositories/userRepository.js';
import { UserEntity } from '../entities/userEntity.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginUserParams {
  username: string;
  password: string;
}

interface LoginUserResult {
  user: UserEntity;
  accessToken: string;
}

export class LoginUser {
  constructor(private userRepository: UserRepository, private jwtSecret: string) {}

  async execute(params: LoginUserParams): Promise<LoginUserResult> {
    const { username, password } = params;

    // 1. Find user by username
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      console.log('DEBUG (LoginUser): User not found for username:', username);
      throw new Error('Invalid credentials.');
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('DEBUG (LoginUser): Password mismatch for user:', username);
      throw new Error('Invalid credentials.');
    }

    // 3. Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    console.log('DEBUG (LoginUser): Payload for JWT:', payload);
    console.log('DEBUG (LoginUser): JWT Secret:', this.jwtSecret);

    // Ensure all payload properties are defined
    if (!payload.user.id || !payload.user.username || !payload.user.email) {
        console.error('ERROR (LoginUser): Payload properties are undefined!', payload.user);
        throw new Error('Internal server error: User data incomplete for token generation.');
    }

    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' }); // Token expires in 1 hour

    return { user, accessToken };
  }
}