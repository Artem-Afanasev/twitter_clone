'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'birthdate', {
            type: Sequelize.DATE,
            allowNull: true,
        });

        await queryInterface.addColumn('users', 'info', {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                len: [1, 250],
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'birthdate');
        await queryInterface.removeColumn('users', 'info');
    },
};
