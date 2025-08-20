import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Like = sequelize.define(
    'Like',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    },
    {
        tableName: 'likes',
        timestamps: true,
    }
);

export default Like;
