// Data Transfer Objects for request/response bodies.
// Request DTOs
export interface RegisterRequestDTO {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  dateOfBirth: Date;
  email: string;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Response DTOs
export interface AuthResponseDTO {
  message: string;
  accessToken?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface ErrorResponseDTO {
  message: string;
  error?: any;
}