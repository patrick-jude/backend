// Logic for user registration.

import { UserRepository } from '../repositories/userRepository.js';
import { UserEntity } from '../entities/userEntity.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface RegisterUserParams {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  age: number;
  email: string;
}

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(params: RegisterUserParams): Promise<UserEntity> {
    const { username, password, confirmPassword, email } = params;

    // 1. Validate input
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    // 2. Check if username or email already exists
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Username already taken.');
    }

    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email address already registered.');
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create new UserEntity
    const newUser: UserEntity = {
      id: uuidv4(), // Generate a unique ID
      username: params.username,
      passwordHash: passwordHash,
      firstName: params.firstName,
      lastName: params.lastName,
      address: params.address,
      gender: params.gender,
      age: params.age,
      email: params.email,
    };

    // 5. Save user
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }
}
