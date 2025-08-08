import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createAuthRoutes } from './presentation/routes/authRoutes.js';
import { AuthController } from './presentation/controllers/authController.js';
import { RegisterUser } from './domain/use-cases/registerUser.js';
import { LoginUser } from './domain/use-cases/loginUser.js'; 
import { ForgotPassword } from './domain/use-cases/forgotPassword.js';
import { UserRepositoryImpl } from './data/repositories-imp/userRepositoryImp.js';
import { initializeDatabase, closeDatabaseConnection } from './data/data-sources/database.js'; //+ Import the database initializer


// Load environment variables from .env file
dotenv.config();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable if you need to send cookies
};

const app = express();
app.use(cors(corsOptions));

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST: string = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_default_key_please_change_this_in_production';


// --- ADD THIS CONSOLE.LOG ---
// console.log('Loaded JWT_SECRET:', JWT_SECRET);
// --- END ADDITION ---

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set in your .env file. Using a default, insecure key.');
  console.warn('Please set JWT_SECRET in your .env for security.');
}

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}, Content-Type: ${req.headers['content-type']}`);
  next();
});

// Middleware
app.use(express.json()); // For parsing JSON request bodies

// Dependency Injection / Composition Root
const userRepository = new UserRepositoryImpl();
const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository, JWT_SECRET);
const forgotPasswordUseCase = new ForgotPassword(userRepository);

const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  forgotPasswordUseCase
);

// Routes
app.use('/api/auth', createAuthRoutes(authController));

// Basic health check route
app.get('/', (req, res) => {
  res.send('Node.js TypeScript Auth Backend is running!');
});

// // Function to close the database connection
// const closeDatabase = async () => {
//   try {
//     const sequelize = getSequelizeInstance();
//     await sequelize.close();
//     console.log('Database connection closed.');
//   } catch (error) {
//     console.error('Error closing database connection:', error);
//   }
// };

// Start the server after database initialization
// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    await initializeDatabase();
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access it at: http://${HOST}:${PORT}`);
      console.log(`To stop the server use the command: 'Ctrl + C`);
    });
  };
  startServer();
}


// Export app and database functions for testing
export { app, initializeDatabase, closeDatabaseConnection };