import { Sequelize } from 'sequelize';
import { dbConfig } from '../../utils/database-conf.js'; // Import your DB config
import { defineUserModel, User as UserModelType } from '../models/userModel.js'; // Import the user model definition

let sequelizeInstance: Sequelize | null = null;
let userModel: typeof UserModelType | null = null;

export const initializeDatabase = async () => {
  if (sequelizeInstance) {
    console.log('Database already initialized. Skipping.');
    return; // Prevent re-initialization
  }

  try {
    sequelizeInstance = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        // --- IMPORTANT: Add `dialectModule` for better ESM compatibility with Sequelize ---
        // This explicitly tells Sequelize to load the 'pg' module.
        dialectModule: await import('pg'),
      }
    );

    // Authenticate the connection
    await sequelizeInstance.authenticate();
    console.log('Database connection has been established successfully.');

    // Define models using the *initialized* sequelizeInstance
    userModel = defineUserModel(sequelizeInstance); // Assign the defined model

    // Synchronize all models (create tables if they don't exist)
    await sequelizeInstance.sync({ force: false });
    console.log('Database synchronized: All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const getSequelizeInstance = (): Sequelize => {
  if (!sequelizeInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return sequelizeInstance;
};

// Export the initialized User model directly
export const User = (): typeof UserModelType => {
  if (!userModel) {
    throw new Error('User model not initialized. Call initializeDatabase() first.');
  }
  return userModel;
};

// Add a function to close the database connection explicitly
export const closeDatabaseConnection = async () => {
  if (sequelizeInstance) {
    await sequelizeInstance.close();
    sequelizeInstance = null; // Clear the instance
    userModel = null; // Clear the model
    console.log('Database connection closed.');
  }
};