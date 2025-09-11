// components/HomeFeed.tsx
import React, { useState, useEffect } from 'react';
import { tweetAPI, Tweet } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Post extends Tweet {
    likesCount: number;
    isLiked?: boolean;
}

const HomeFeed: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Загрузка ленты...');

            const allPosts = await tweetAPI.getAllTweets();
            console.log('✅ Получено постов:', allPosts.length);

            // Для каждого поста проверяем, лайкнул ли его текущий пользователь И получаем актуальное количество лайков
            const postsWithLikes = await Promise.all(
                allPosts.map(async (post: any) => {
                    try {
                        const [likeStatus, likesInfo] = await Promise.all([
                            tweetAPI.checkUserLike(post.id),
                            tweetAPI.getTweetLikes(post.id),
                        ]);

                        return {
                            ...post,
                            likesCount: likesInfo.likeCount || 0, // ← ИСПРАВЛЕНО: используем актуальное количество
                            isLiked: likeStatus.liked,
                        };
                    } catch (error) {
                        console.error(
                            `❌ Ошибка проверки лайка для поста ${post.id}:`,
                            error
                        );
                        return {
                            ...post,
                            likesCount: post.likesCount || 0,
                            isLiked: false,
                        };
                    }
                })
            );

            console.log('📦 Посты с информацией о лайках:', postsWithLikes);
            setPosts(postsWithLikes);
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

    const handleUserClick = (userId: number) => {
        navigate(`/usersprofile/${userId}`);
    };

    const handleLike = async (postId: number, currentlyLiked: boolean) => {
        try {
            let response: { likeCount: number; message: string };

            if (currentlyLiked) {
                // Убираем лайк
                response = await tweetAPI.unlikeTweet(postId);
            } else {
                // Ставим лайк
                response = await tweetAPI.likeTweet(postId);
            }

            // Обновляем состояние поста
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              likesCount: response.likeCount,
                              isLiked: !currentlyLiked,
                          }
                        : post
                )
            );
        } catch (error) {
            console.error('❌ Ошибка при лайке:', error);
            // Можно добавить уведомление пользователю
        }
    };

    const renderAvatar = (user: any) => {
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
                        cursor: 'pointer', // Добавьте курсор
                    }}
                    onClick={() => user?.id && handleUserClick(user.id)}
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
                        cursor: 'pointer', // Добавьте курсор
                    }}
                    onClick={() => handleUserClick(user.id)}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            );
        }

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
                    cursor: 'pointer', // Добавьте курсор
                }}
                onClick={() => handleUserClick(user.id)}
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
                                    justifyContent: 'flex-start', // выравниваем по левому краю
                                    width: '100%',
                                }}
                            >
                                {renderAvatar(post.user)}
                                <div
                                    style={{
                                        marginLeft: '0',
                                        width: 'calc(100% - 60px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#14171a',
                                            fontSize: '16px',
                                            marginRight: '12px',
                                            cursor: 'pointer', // Добавьте курсор
                                            textDecoration: 'underline', // Подчеркивание для интерактивности
                                        }}
                                        onClick={() =>
                                            post.user?.id &&
                                            handleUserClick(post.user.id)
                                        }
                                    >
                                        {post.user?.username ||
                                            'Неизвестный автор'}
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
                                    textAlign: 'left',
                                }}
                            >
                                {post.content}
                            </div>

                            {/* БЛОК ИЗОБРАЖЕНИЙ */}
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
                                        marginBottom: '20px',
                                    }}
                                >
                                    {post.images.map(
                                        (image: string, index: number) => (
                                            <div
                                                key={index}
                                                style={{
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    aspectRatio: '1',
                                                }}
                                                onClick={() =>
                                                    setExpandedImage(image)
                                                }
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Изображение ${
                                                        index + 1
                                                    }`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition:
                                                            'transform 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform =
                                                            'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform =
                                                            'scale(1)';
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            'none';
                                                    }}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* КНОПКА ЛАЙКА И СЧЕТЧИК */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '15px',
                                }}
                            >
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
                                        marginLeft: 'auto',
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
                                        {post.likesCount}{' '}
                                        {/* ← СЧЕТЧИК НА КНОПКЕ */}
                                    </span>
                                </button>
                            </div>

                            {/* Модальное окно для просмотра изображения */}
                            {expandedImage && (
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: 1000,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setExpandedImage(null)}
                                >
                                    <img
                                        src={expandedImage}
                                        alt="Увеличенное изображение"
                                        style={{
                                            maxWidth: '90%',
                                            maxHeight: '90%',
                                            objectFit: 'contain',
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}

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
