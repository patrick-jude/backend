import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Define the attributes that are optional for model creation (e.g., ID is auto-generated)
interface UserAttributes {
  id: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  age: number;
  email: string;
}

// Define the attributes that are optional for model creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public address!: string;
  public gender!: string;
  public age!: number;
  public email!: string;

  // Timestamps (Sequelize automatically adds createdAt and updatedAt)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Function to define the User model in Sequelize
export const defineUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use UUID for primary key
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize, // The Sequelize instance
      tableName: 'users', // Name of the table in the database
      timestamps: true, // Automatically add createdAt and updatedAt fields
      modelName: 'User', // Name of the model
    }
  );
  return User;
};