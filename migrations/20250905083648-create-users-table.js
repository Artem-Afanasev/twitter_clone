'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('tweets', 'imageUrl');
    },

    async down(queryInterface, Sequelize) {},
};
