import sequelize from '../database/sequelize.js';

import User from './Users.js';
import { Tweet, PostImage } from './Post.js';
import Like from './Like.js';
import Subscription from './Subscriptions.js';
import { Comment } from './Comment.js';

User.hasMany(Tweet, { foreignKey: 'userId', as: 'tweets' });
Tweet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Tweet.hasMany(PostImage, { foreignKey: 'tweetId', as: 'images' });
PostImage.belongsTo(Tweet, { foreignKey: 'tweetId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Tweet.hasMany(Like, { foreignKey: 'tweetId' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Tweet.hasMany(Comment, { foreignKey: 'tweetId' });
Comment.belongsTo(Tweet, { foreignKey: 'tweetId' });

Subscription.belongsTo(User, { as: 'follower', foreignKey: 'followerId' });
Subscription.belongsTo(User, { as: 'following', foreignKey: 'followingId' });

User.belongsToMany(User, {
    through: 'Subscription',
    as: 'followers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
});

User.belongsToMany(User, {
    through: 'Subscription',
    as: 'following',
    foreignKey: 'followerId',
    otherKey: 'followingId',
});

console.log('Все модели и ассоциации инициализированы');

export { sequelize, User, Tweet, PostImage, Like, Subscription, Comment };
