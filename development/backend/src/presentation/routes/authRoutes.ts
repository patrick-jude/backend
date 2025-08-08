// Defines the API endpoints.

import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/register', authController.register.bind(authController));
  router.post('/login', authController.login.bind(authController));
  router.post('/forgot-password', authController.forgotPassword.bind(authController));

  return router;
};