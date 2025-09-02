import { UserRepository } from '../../domain/repositories/userRepository.js';
import { UserEntity } from '../../domain/entities/userEntity.js';
import { User } from '../data-sources/database.js';
import { User as UserModelType } from '../models/userModel.js'; // Import the Sequelize User model

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const userModel = await User().findByPk(id);
    console.log('DEBUG (UserRepository): findById - Raw UserModel:', userModel?.toJSON());
    return userModel ? this.toEntity(userModel) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const userModel = await User().findOne({ where: { username } });
    console.log('DEBUG (UserRepository): findByUsername - Raw UserModel:', userModel?.toJSON());
    return userModel ? this.toEntity(userModel) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userModel = await User().findOne({ where: { email } });
    console.log('DEBUG (UserRepository): findByEmail - Raw UserModel:', userModel?.toJSON());
    return userModel ? this.toEntity(userModel) : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    // Sequelize will generate ID if not provided, but we generate it in use-case for consistency
    const createdUser = await User().create(user);
    console.log('DEBUG (UserRepository): save - Created UserModel:', createdUser.toJSON());
    return this.toEntity(createdUser);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const [affectedCount] = await User().update(user, {
      where: { id: user.id },
    });

    if (affectedCount === 0) {
      throw new Error('User not found for update');
    }
    const updatedUser = await User().findByPk(user.id);
    if (!updatedUser) {
        throw new Error('Updated user not found after update operation');
    }
    console.log('DEBUG (UserRepository): update - Updated UserModel:', updatedUser.toJSON());
    return this.toEntity(updatedUser);
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<boolean> {
    const [affectedCount] = await User().update(
      { passwordHash: newPasswordHash },
      { where: { id: userId } }
    );
    console.log('DEBUG (UserRepository): updatePassword - Affected Count:', affectedCount);
    return affectedCount > 0;
  }

  // --- Mappers between Entity (Domain) and Model (Data) ---
  private toEntity(model: UserModelType): UserEntity {
    // Use model.toJSON() to get a plain JavaScript object with all data
    const rawData = model.toJSON();

    const entity: UserEntity = {
      id: rawData.id,
      username: rawData.username,
      passwordHash: rawData.passwordHash,
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      address: rawData.address,
      gender: rawData.gender,
      dateOfBirth: rawData.dateOfBirth,
      email: rawData.email,
    };
    console.log('DEBUG (UserRepository): toEntity - Converted UserModel to UserEntity:', entity);
    return entity;
  }
}