import React, { useState, useEffect } from 'react';
import { subscriptionAPI, tweetAPI } from '../services/api';

interface Post {
    id: number;
    content: string;
    createdAt: string;
    images: string[];
    likesCount: number;
    isLiked?: boolean;
    user: {
        id: number;
        username: string;
        avatar?: string;
    };
}

const FollowingPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchFollowingPosts();
    }, [currentPage]);

    const fetchFollowingPosts = async () => {
        try {
            setLoading(true);
            const response = await subscriptionAPI.getFollowingPosts(
                currentPage,
                10
            );
            setPosts(response.posts);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при загрузке постов');
            console.error('❌ Ошибка загрузки постов подписок:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId: number, currentlyLiked: boolean) => {
        try {
            let response: { likeCount: number; message: string };

            if (currentlyLiked) {
                response = await tweetAPI.unlikeTweet(postId);
            } else {
                response = await tweetAPI.likeTweet(postId);
            }

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
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#657786',
                }}
            >
                Загрузка постов...
            </div>
        );
    }

    if (error && posts.length === 0) {
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

    if (posts.length === 0) {
        return (
            <div
                style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#657786',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    margin: '20px 0',
                    border: '1px solid #e1e8ed',
                }}
            >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#14171a' }}>
                    Нет постов от подписок
                </h3>
                <p style={{ margin: 0, fontSize: '16px' }}>
                    Подпишитесь на пользователей, чтобы видеть их посты здесь
                </p>
            </div>
        );
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
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
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '16px',
                                gap: '12px',
                            }}
                        >
                            {post.user.avatar ? (
                                <img
                                    src={post.user.avatar}
                                    alt={post.user.username}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#1da1f2',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                    }}
                                >
                                    {post.user.username
                                        ?.charAt(0)
                                        ?.toUpperCase() || 'U'}
                                </div>
                            )}

                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '4px',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#14171a',
                                            fontSize: '16px',
                                        }}
                                    >
                                        @{post.user.username}
                                    </span>
                                    <span
                                        style={{
                                            color: '#657786',
                                            fontSize: '14px',
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            color: '#657786',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleString('ru-RU', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                margin: '0 0 16px 0',
                                fontSize: '16px',
                                lineHeight: '1.4',
                                color: '#14171a',
                                textAlign: 'left',
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
                                    gap: '4px',
                                    marginBottom: '16px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                {post.images.map(
                                    (image: string, index: number) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'relative',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                aspectRatio: '1',
                                            }}
                                            onClick={() =>
                                                setExpandedImage(image)
                                            }
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

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <button
                                onClick={() =>
                                    handleLike(post.id, post.isLiked || false)
                                }
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '20px',
                                    backgroundColor: post.isLiked
                                        ? '#ffe6ea'
                                        : '#f7f9fa',
                                    color: post.isLiked ? '#e0245e' : '#657786',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        post.isLiked ? '#ffd1d9' : '#e1e8ed';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        post.isLiked ? '#ffe6ea' : '#f7f9fa';
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>
                                    {post.isLiked ? '❤️' : '🤍'}
                                </span>
                                <span style={{ fontWeight: 'bold' }}>
                                    {post.likesCount}
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                        gap: '10px',
                    }}
                >
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #e1e8ed',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            color: currentPage === 1 ? '#657786' : '#1da1f2',
                            cursor:
                                currentPage === 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        ← Назад
                    </button>

                    <span style={{ padding: '8px 16px', color: '#657786' }}>
                        Страница {currentPage} из {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #e1e8ed',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            color:
                                currentPage === totalPages
                                    ? '#657786'
                                    : '#1da1f2',
                            cursor:
                                currentPage === totalPages
                                    ? 'not-allowed'
                                    : 'pointer',
                        }}
                    >
                        Вперед →
                    </button>
                </div>
            )}

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
        </div>
    );
};

export default FollowingPosts;
