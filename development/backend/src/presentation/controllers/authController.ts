// Handles HTTP requests and calls use cases.

import { Request, Response } from 'express';
import { RegisterUser } from '../../domain/use-cases/registerUser.js';
import { LoginUser } from '../../domain/use-cases/loginUser.js';
import { ForgotPassword } from '../../domain/use-cases/forgotPassword.js';
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  ForgotPasswordRequestDTO,
  AuthResponseDTO,
  ErrorResponseDTO,
} from '../dto/authDto.js';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUser,
    private loginUserUseCase: LoginUser,
    private forgotPasswordUseCase: ForgotPassword
  ) {}

  async register(req: Request<{}, {}, RegisterRequestDTO>, res: Response<AuthResponseDTO | ErrorResponseDTO>) {
    try {
      const newUser = await this.registerUserUseCase.execute(req.body);
      res.status(201).json({
        message: 'User registered successfully!',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error.message);
      res.status(400).json({ message: error.message || 'Registration failed.' });
    }
  }

  async login(req: Request<{}, {}, LoginRequestDTO>, res: Response<AuthResponseDTO | ErrorResponseDTO>) {
    try {
      const { user, accessToken } = await this.loginUserUseCase.execute(req.body);
      res.status(200).json({
        message: 'Login successful!',
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error.message);
      res.status(401).json({ message: error.message || 'Login failed.' });
    }
  }

  async forgotPassword(req: Request<{}, {}, ForgotPasswordRequestDTO>, res: Response<AuthResponseDTO | ErrorResponseDTO>) {
    try {
      const success = await this.forgotPasswordUseCase.execute(req.body);
      if (success) {
        res.status(200).json({ message: 'Password reset initiated.' });
      } else {
        // Still return 200 to avoid revealing if email exists, but provide a generic message
        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }
    } catch (error: any) {
      console.error('Forgot password error:', error.message);
      res.status(400).json({ message: error.message || 'Password reset failed.' });
    }
  }
}