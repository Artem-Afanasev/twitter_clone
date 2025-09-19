'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            comment: {
                type: Sequelize.STRING(280),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            tweetId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'tweets',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('comments', ['userId']);
        await queryInterface.addIndex('comments', ['tweetId']);
        await queryInterface.addIndex('comments', ['createdAt']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('comments');
    },
};
