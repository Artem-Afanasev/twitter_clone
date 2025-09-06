import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

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
                len: [1, 280],
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'tweets',
        timestamps: true,
    }
);

const PostImage = sequelize.define(
    'PostImage',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        tweetId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'post_images',
        timestamps: true,
    }
);

export { Tweet, PostImage };
