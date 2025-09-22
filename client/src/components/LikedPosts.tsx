// components/LikedPosts.tsx
import React, { useState, useEffect } from 'react';
import { tweetAPI, Tweet } from '../services/api';

interface Post extends Tweet {
    likesCount: number;
    isLiked?: boolean;
}

const LikedPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                setLoading(true);
                setError('');
                console.log(' Загрузка лайкнутых постов...');

                const likedPosts = await tweetAPI.getUserLikedTweets();
                console.log(' Ответ от сервера:', likedPosts);

                if (likedPosts.length > 0) {
                    console.log(' Структура первого поста:', likedPosts[0]);
                    console.log(
                        ' Изображения первого поста:',
                        likedPosts[0].images
                    );
                }

                const postsWithLikes: Post[] = likedPosts.map((tweet) => ({
                    ...tweet,
                    likesCount: tweet.likesCount || 0,
                    isLiked: true,
                }));

                setPosts(postsWithLikes);
            } catch (err: any) {
                console.error('❌ Ошибка загрузки лайкнутых постов:', err);
                setError('Ошибка при загрузке лайкнутых постов');
            } finally {
                setLoading(false);
            }
        };

        fetchLikedPosts();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#657786',
                }}
            >
                📡 Загрузка лайкнутых постов...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#ff4444',
                }}
            >
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div>
            <h3
                style={{
                    marginBottom: '20px',
                    color: '#1da1f2',
                    textAlign: 'center',
                }}
            >
                ❤️ Лайкнутые посты
            </h3>

            {posts.length === 0 ? (
                <div
                    style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#657786',
                        backgroundColor: '#f7f9fa',
                        borderRadius: '16px',
                    }}
                >
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                        ❤️
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#14171a' }}>
                        Нет лайкнутых постов
                    </h4>
                    <p style={{ margin: 0, fontSize: '16px' }}>
                        Посты, которые вам понравятся, появятся здесь
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                padding: '20px',
                                border: '1px solid #e1e8ed',
                                borderRadius: '16px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    gap: '12px',
                                }}
                            >
                                {post.user?.avatar ? (
                                    <img
                                        src={post.user.avatar}
                                        alt={post.user.username}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background:
                                                'linear-gradient(135deg, #1da1f2, #657786)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {post.user?.username
                                            ?.charAt(0)
                                            ?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#14171a',
                                        }}
                                    >
                                        {post.user?.username ||
                                            'Неизвестный автор'}
                                    </div>
                                    <div
                                        style={{
                                            color: '#657786',
                                            fontSize: '14px',
                                        }}
                                    >
                                        @{post.user?.username || 'unknown'}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginBottom: '15px',
                                    color: '#14171a',
                                    lineHeight: '1.5',
                                }}
                            >
                                {post.content}
                            </div>
                            {post.images && post.images.length > 0 && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns:
                                            post.images.length === 1
                                                ? '1fr'
                                                : post.images.length === 2
                                                ? 'repeat(2, 1fr)'
                                                : 'repeat(3, 1fr)',
                                        gap: '8px',
                                        marginBottom: '15px',
                                    }}
                                >
                                    {post.images.map((image, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'relative',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                aspectRatio: '1',
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`Изображение ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition:
                                                        'transform 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform =
                                                        'scale(1.02)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform =
                                                        'scale(1)';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: '#657786',
                                    fontSize: '14px',
                                }}
                            >
                                <div>
                                    📅{' '}
                                    {new Date(post.createdAt).toLocaleString(
                                        'ru-RU'
                                    )}
                                </div>
                                <div>❤️ {post.likesCount} лайков</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikedPosts;
