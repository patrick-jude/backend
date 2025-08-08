// Interface for user data operations (abstract definition)
import { UserEntity } from '../entities/userEntity.js';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  // For forgot password, you might need a method to update password directly or by token
  updatePassword(userId: string, newPasswordHash: string): Promise<boolean>;
}