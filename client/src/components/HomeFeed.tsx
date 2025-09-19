// components/HomeFeed.tsx
import React, { useState, useEffect } from 'react';
import { tweetAPI, Tweet, commentAPI, Comment } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Post extends Tweet {
    likesCount: number;
    isLiked?: boolean;
    showComments?: boolean;
    comments?: Comment[];
    commentsLoading?: boolean;
}

const HomeFeed: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Загрузка ленты...');

            const allPosts = await tweetAPI.getAllTweets();
            console.log('✅ Получено постов:', allPosts.length);

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
                            showComments: false, // По умолчанию скрываем комментарии
                            comments: [], // Пустой массив комментариев
                            commentsLoading: false,
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
                            showComments: false,
                            comments: [],
                            commentsLoading: false,
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

    const loadComments = async (postId: number) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, commentsLoading: true } : post
            )
        );

        try {
            const comments = await commentAPI.getComments(postId);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, comments, commentsLoading: false }
                        : post
                )
            );
        } catch (error) {
            console.error('❌ Ошибка загрузки комментариев:', error);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, commentsLoading: false }
                        : post
                )
            );
        }
    };

    const toggleComments = async (postId: number) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId) {
                    const newShowComments = !post.showComments;

                    // Если показываем комментарии и они еще не загружены - загружаем
                    if (newShowComments && post.comments?.length === 0) {
                        loadComments(postId);
                    }

                    return { ...post, showComments: newShowComments };
                }
                return post;
            })
        );
    };

    const handleSubmitComment = async (postId: number) => {
        if (!commentText.trim()) return;

        try {
            const response = await commentAPI.createComment(
                postId,
                commentText.trim()
            );

            // Добавляем новый комментарий в список
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: [
                                  response.comment,
                                  ...(post.comments || []),
                              ],
                              showComments: true, // Показываем комментарии после отправки
                          }
                        : post
                )
            );

            setCommentText(''); // Очищаем поле ввода
        } catch (error) {
            console.error('❌ Ошибка отправки комментария:', error);
            alert('Ошибка при отправке комментария');
        }
    };
    const renderComments = (post: Post) => {
        if (!post.showComments) return null;

        return (
            <div
                style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f7f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e1e8ed',
                }}
            >
                {/* Форма для нового комментария */}
                <div style={{ marginBottom: '20px' }}>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Напишите комментарий..."
                        style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '12px',
                            border: '1px solid #e1e8ed',
                            borderRadius: '8px',
                            resize: 'vertical',
                            fontSize: '14px',
                            marginBottom: '10px',
                        }}
                        maxLength={280}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '12px',
                                color:
                                    commentText.length === 280
                                        ? '#ff4444'
                                        : '#657786',
                            }}
                        >
                            {commentText.length}/280
                        </span>
                        <button
                            onClick={() => handleSubmitComment(post.id)}
                            disabled={!commentText.trim()}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: commentText.trim()
                                    ? '#1da1f2'
                                    : '#aab8c2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: commentText.trim()
                                    ? 'pointer'
                                    : 'not-allowed',
                                fontSize: '14px',
                            }}
                        >
                            Отправить
                        </button>
                    </div>
                </div>

                {/* Список комментариев */}
                {post.commentsLoading ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#657786',
                        }}
                    >
                        Загрузка комментариев...
                    </div>
                ) : post.comments && post.comments.length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {post.comments.map((comment) => (
                            <div
                                key={comment.id}
                                style={{
                                    padding: '12px',
                                    marginBottom: '10px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e1e8ed',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                    }}
                                >
                                    {comment.User && (
                                        <div style={{ flexShrink: 0 }}>
                                            {renderAvatar(comment.User)}
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px',
                                                    marginRight: '8px',
                                                }}
                                            >
                                                {comment.User?.username ||
                                                    'Неизвестный'}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#657786',
                                                }}
                                            >
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleString('ru-RU')}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                lineHeight: '1.4',
                                            }}
                                        >
                                            {comment.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#657786',
                        }}
                    >
                        Пока нет комментариев. Будьте первым!
                    </div>
                )}
            </div>
        );
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

                                <button
                                    onClick={() => toggleComments(post.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '20px',
                                        backgroundColor: post.showComments
                                            ? '#1da1f2'
                                            : '#f7f9fa',
                                        color: post.showComments
                                            ? 'white'
                                            : '#657786',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>💬</span>
                                    <span>
                                        Комментарии{' '}
                                        {post.comments
                                            ? `(${post.comments.length})`
                                            : ''}
                                    </span>
                                </button>
                            </div>
                            {/* БЛОК КОММЕНТАРИЕВ */}
                            {renderComments(post)}

                            {/* Время создания */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#657786',
                                    fontSize: '14px',
                                }}
                            ></div>

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
