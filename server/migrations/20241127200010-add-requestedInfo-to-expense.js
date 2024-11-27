'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Expense', 'requestedInfo', {
      type: Sequelize.STRING, // Adjust type as necessary
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Expense', 'requestedInfo');
  },
};
