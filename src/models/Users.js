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
            type: DataTypes.STRING(500), // Для хранения пути к файлу
            defaultValue: '',
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
                // Автоматически генерируем аватар если не указан
                if (!user.avatar) {
                    user.avatar = `/uploads/avatars/default/${user.username
                        .charAt(0)
                        .toUpperCase()}.png`;
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
