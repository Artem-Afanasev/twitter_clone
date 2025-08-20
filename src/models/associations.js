import User from './Users.js';
import Tweet from './Tweet.js';
import Like from './Like.js';

// Пользователь имеет много твитов
User.hasMany(Tweet, { foreignKey: 'authorId', as: 'tweets' });
Tweet.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Пользователь имеет много лайков
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

// Твит имеет много лайков
Tweet.hasMany(Like, { foreignKey: 'tweetId' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId' });

// Подписки (многие-ко-многим)
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
