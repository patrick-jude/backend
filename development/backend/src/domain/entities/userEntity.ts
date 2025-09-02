// Defines the core User entity (domain model)
export interface UserEntity {
  id: string; // Unique identifier for the user
  username: string;
  passwordHash: string; // Storing the hashed password
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  dateOfBirth: Date;
  email: string;
  // Add any other fields that are part of the core user data
}