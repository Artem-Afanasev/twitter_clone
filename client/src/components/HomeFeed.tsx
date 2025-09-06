// components/HomeFeed.tsx
import React, { useState, useEffect } from 'react';
import { tweetAPI } from '../services/api';

const HomeFeed: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Загрузка ленты...');

            const allPosts = await tweetAPI.getAllTweets();
            if (allPosts.length > 0) {
                console.log('📦 Структура первого поста:', allPosts[0]);
                console.log('👤 Данные пользователя:', allPosts[0].user);
                console.log('👤 Или User?:', allPosts[0].user);
            }
            setPosts(allPosts);
        } catch (err: any) {
            console.error('❌ Ошибка загрузки ленты:', err);
            setError('Ошибка при загрузке ленты');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const renderAvatar = (user: any) => {
        // Добавьте проверку
        if (!user) {
            return (
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1da1f2, #657786)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        flexShrink: 0,
                    }}
                >
                    U
                </div>
            );
        }

        if (user?.avatar) {
            return (
                <img
                    src={user.avatar}
                    alt={user.username}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #1da1f2',
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            );
        }

        // Fallback аватар
        return (
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1da1f2, #657786)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    flexShrink: 0,
                }}
            >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
        );
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#657786',
                    fontSize: '18px',
                }}
            >
                📡 Загрузка ленты...
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
                    fontSize: '16px',
                }}
            >
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div>
            <h2
                style={{
                    marginBottom: '25px',
                    color: '#1da1f2',
                    fontSize: '28px',
                    textAlign: 'center',
                }}
            >
                Домашняя лента
            </h2>

            {posts.length === 0 ? (
                <div
                    style={{
                        padding: '60px 20px',
                        textAlign: 'center',
                        color: '#657786',
                        backgroundColor: '#f7f9fa',
                        borderRadius: '16px',
                        margin: '20px 0',
                    }}
                >
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                        🌅
                    </div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#14171a' }}>
                        Лента пуста
                    </h3>
                    <p style={{ margin: 0, fontSize: '16px' }}>
                        Будьте первым, кто напишет что-нибудь!
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
                                padding: '25px',
                                border: '1px solid #e1e8ed',
                                borderRadius: '16px',
                                backgroundColor: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                            }}
                        >
                            {/* Шапка поста с автором */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    gap: '12px',
                                }}
                            >
                                {/* Аватар пользователя */}
                                {renderAvatar(post.user || post.User)}

                                <div>
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#14171a',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {post.user?.username ||
                                            post.User?.username ||
                                            'Неизвестный автор'}
                                    </div>
                                    <div
                                        style={{
                                            color: '#657786',
                                            fontSize: '14px',
                                        }}
                                    >
                                        @
                                        {post.user?.username ||
                                            post.User?.username ||
                                            'unknown'}
                                    </div>
                                </div>
                            </div>

                            {/* Содержание твита */}
                            <div
                                style={{
                                    margin: '0 0 20px 0',
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    color: '#14171a',
                                }}
                            >
                                {post.content}
                            </div>

                            {/* Время создания */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#657786',
                                    fontSize: '14px',
                                }}
                            >
                                <span>📅</span>
                                <span>
                                    {new Date(post.createdAt).toLocaleString(
                                        'ru-RU',
                                        {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeFeed;
