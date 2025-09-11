// pages/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileAPI, tweetAPI } from '../services/api';
import '../styles/Profile.css';

interface UserProfileResponse {
    user: {
        id: number;
        username: string;
        email: string;
        avatar?: string;
        createdAt: string;
        postsCount: number;
    };
    posts: Tweet[];
}

interface Tweet {
    id: number;
    content: string;
    createdAt: string;
    images: string[];
    likesCount: number;
    isLiked?: boolean;
}

const UserProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserProfileResponse['user'] | null>(null);
    const [posts, setPosts] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                setError('');

                // Получаем данные пользователя и его посты
                const response = await profileAPI.getUserProfile(
                    Number(userId)
                );
                setUser(response.user);
                setPosts(response.posts);
            } catch (err: any) {
                console.error('❌ Ошибка загрузки профиля:', err);
                setError(err.message || 'Ошибка при загрузке профиля');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [userId]);

    const handleLike = async (postId: number, currentlyLiked: boolean) => {
        try {
            let response: { likeCount: number; message: string };

            if (currentlyLiked) {
                response = await tweetAPI.unlikeTweet(postId);
            } else {
                response = await tweetAPI.likeTweet(postId);
            }

            // Обновляем состояние поста
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              likesCount: response.likeCount,
                              isLiked: !currentlyLiked, // ← Важно: меняем статус лайка
                          }
                        : post
                )
            );
        } catch (error) {
            console.error('❌ Ошибка при лайке:', error);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#657786',
                }}
            >
                Загрузка профиля...
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

    if (!user) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#657786',
                }}
            >
                Пользователь не найден
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-layout">
                {/* Левая колонка - информация о пользователе */}
                <div className="profile-sidebar">
                    <div className="user-card">
                        <div className="user-avatar">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="avatar-image"
                                />
                            ) : (
                                <span className="avatar-fallback">
                                    {user.username?.charAt(0)?.toUpperCase() ||
                                        'U'}
                                </span>
                            )}
                        </div>

                        <h2 className="username">@{user.username}</h2>

                        <div className="user-info">
                            <div className="info-item">
                                <span className="label">📅 Регистрация:</span>
                                <span className="value">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString('ru-RU')}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="label">📝 Постов:</span>
                                <span className="value">{user.postsCount}</span>
                            </div>
                        </div>

                        <Link to="/home" className="back-btn">
                            ← Назад к ленте
                        </Link>
                    </div>
                </div>

                {/* Правая колонка - посты пользователя */}
                <div className="profile-content">
                    <h3 style={{ marginBottom: '20px', color: '#1da1f2' }}>
                        Посты пользователя ({posts.length})
                    </h3>

                    {posts.length === 0 ? (
                        <div
                            style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#657786',
                            }}
                        >
                            У пользователя нет постов
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }}
                        >
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    style={{
                                        padding: '20px',
                                        border: '1px solid #e1e8ed',
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <p
                                        style={{
                                            margin: '0 0 15px 0',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {post.content}
                                    </p>

                                    {post.images && post.images.length > 0 && (
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns:
                                                    'repeat(auto-fit, minmax(100px, 1fr))',
                                                gap: '8px',
                                                marginBottom: '15px',
                                            }}
                                        >
                                            {post.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Изображение ${
                                                        index + 1
                                                    }`}
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() =>
                                            handleLike(
                                                post.id,
                                                post.isLiked || false
                                            )
                                        }
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: '20px',
                                            backgroundColor: '#f7f9fa',
                                            color: '#657786',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginBottom: '10px',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                '#e1e8ed';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                '#f7f9fa';
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>
                                            {post.isLiked ? '❤️' : '🤍'}
                                        </span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {post.likesCount}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
