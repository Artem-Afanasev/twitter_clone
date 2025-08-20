import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Tweet = sequelize.define(
    'Tweet',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING(280),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        tableName: 'tweets',
        timestamps: true,
    }
);

export default Tweet;
