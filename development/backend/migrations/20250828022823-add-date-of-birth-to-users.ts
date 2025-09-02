import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    return queryInterface.addColumn('users', 'dateOfBirth', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn('users', 'dateOfBirth');
  }
};