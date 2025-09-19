import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import User from './Users.js';

const Subscription = sequelize.define(
    'Subscription',
    {
        followerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        followingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        tableName: 'user_followers',
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

Subscription.removeAttribute('id');

export default Subscription;
