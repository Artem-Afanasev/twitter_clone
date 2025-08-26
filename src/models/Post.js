import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import User from './Users.js';

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
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        tableName: 'tweets',
        timestamps: true,
    }
);

Tweet.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Tweet, { foreignKey: 'userId' });

export default Tweet;
