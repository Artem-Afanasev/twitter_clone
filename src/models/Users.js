import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
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

        birthdate: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: true,
                isBefore: new Date().toISOString(),
            },
        },

        info: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [1, 250],
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
            type: DataTypes.STRING(500),
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

User.prototype.getFollowers = async function () {
    return await this.getFollowers({
        attributes: ['id', 'username', 'avatar'],
        through: { attributes: [] },
    });
};

User.prototype.getFollowing = async function () {
    return await this.getFollowing({
        attributes: ['id', 'username', 'avatar'],
        through: { attributes: [] },
    });
};

User.prototype.isFollowing = async function (targetUserId) {
    const following = await this.getFollowing({
        where: { id: targetUserId },
        through: { attributes: [] },
    });
    return following.length > 0;
};

User.prototype.follow = async function (targetUserId) {
    if (this.id === targetUserId) {
        throw new Error('Cannot follow yourself');
    }

    return await this.addFollowing(targetUserId);
};

User.prototype.unfollow = async function (targetUserId) {
    return await this.removeFollowing(targetUserId);
};

User.prototype.getFollowersCount = async function () {
    return await this.countFollowers();
};

User.prototype.getFollowingCount = async function () {
    return await this.countFollowing();
};

export default User;
