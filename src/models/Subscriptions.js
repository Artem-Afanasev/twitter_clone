import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import User from './User.js';

const Subscription = sequelize.define(
    'Subscription',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        followerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        followingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        tableName: 'user_followers', // ← Именно так как в ассоциациях!
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['followerId', 'followingId'],
            },
            {
                fields: ['followerId'],
            },
            {
                fields: ['followingId'],
            },
        ],
    }
);

export default Subscription;
