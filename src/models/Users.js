import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 30],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100],
            },
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: '',
            validate: {
                isUrl: true, // Добавляем валидацию URL
            },
        },
    },
    {
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
                // Устанавливаем аватар по умолчанию если не указан
                if (!user.avatar) {
                    user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.username
                    )}&background=1da1f2&color=fff&size=200`;
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        },
    }
);

User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;
