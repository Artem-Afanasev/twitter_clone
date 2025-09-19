import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Comment = sequelize.define(
    'Comment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.STRING(280),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 280],
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tweetId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'comments',
        timestamps: true,
    }
);

export { Comment };
