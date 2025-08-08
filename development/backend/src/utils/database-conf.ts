import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'base_db',
  dialect: 'postgres' as const, // Explicitly type as 'postgres'
  logging: false, // Set to true to see SQL queries in console
};