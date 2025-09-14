'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_followers', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            followerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            followingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
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

        // Добавляем уникальный индекс чтобы избежать дубликатов подписок
        await queryInterface.addIndex('user_followers', {
            fields: ['followerId', 'followingId'],
            unique: true,
            name: 'user_followers_unique_idx',
        });

        // Индексы для быстрого поиска
        await queryInterface.addIndex('user_followers', {
            fields: ['followerId'],
            name: 'user_followers_follower_idx',
        });

        await queryInterface.addIndex('user_followers', {
            fields: ['followingId'],
            name: 'user_followers_following_idx',
        });

        console.log('✅ Таблица user_followers создана успешно');
    },

    async down(queryInterface, Sequelize) {
        // Удаляем индексы сначала
        await queryInterface.removeIndex(
            'user_followers',
            'user_followers_unique_idx'
        );
        await queryInterface.removeIndex(
            'user_followers',
            'user_followers_follower_idx'
        );
        await queryInterface.removeIndex(
            'user_followers',
            'user_followers_following_idx'
        );

        // Затем удаляем таблицу
        await queryInterface.dropTable('user_followers');

        console.log('✅ Таблица user_followers удалена');
    },
};
