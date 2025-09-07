import sequelize from '../database/sequelize.js';

import User from './Users.js';
import { Tweet, PostImage } from './Post.js';
import Like from './Like.js';

User.hasMany(Tweet, { foreignKey: 'userId', as: 'tweets' });
Tweet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Tweet.hasMany(PostImage, { foreignKey: 'tweetId', as: 'images' });
PostImage.belongsTo(Tweet, { foreignKey: 'tweetId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Tweet.hasMany(Like, { foreignKey: 'tweetId' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId' });

User.belongsToMany(User, {
    through: 'user_followers',
    as: 'followers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
});

User.belongsToMany(User, {
    through: 'user_followers',
    as: 'following',
    foreignKey: 'followerId',
    otherKey: 'followingId',
});

console.log('✅ Все модели и ассоциации инициализированы');

export { sequelize, User, Tweet, PostImage, Like };
