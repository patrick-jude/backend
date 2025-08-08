// Logic for password reset.
// NOTE: In a real application, this would involve sending an email with a reset token.
// For this example, we'll simulate the reset with a direct password update.

import { UserRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

interface ForgotPasswordParams {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

export class ForgotPassword {
  constructor(private userRepository: UserRepository) {}

  async execute(params: ForgotPasswordParams): Promise<boolean> {
    const { email, newPassword, confirmNewPassword } = params;

    // 1. Validate input
    if (newPassword !== confirmNewPassword) {
      throw new Error('New passwords do not match.');
    }

    // 2. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // For security, do not reveal if the email exists or not
      console.warn(`Attempted password reset for non-existent email: ${email}`);
      return false; // Or true, to prevent enumeration attacks
    }

    // 3. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 4. Update the user's password
    const success = await this.userRepository.updatePassword(user.id, newPasswordHash);

    return success;
  }
}