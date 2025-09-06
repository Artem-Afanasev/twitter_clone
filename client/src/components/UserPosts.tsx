import React, { useState, useEffect } from 'react';
import { tweetAPI } from '../services/api';

const UserPosts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const fetchUserPosts = async () => {
        try {
            setLoading(true);
            setError('');
            const userPosts = await tweetAPI.getMyTweets();
            setPosts(userPosts);
        } catch (err: any) {
            setError('Ошибка при загрузке постов');
            console.error('Ошибка загрузки постов:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, []);

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Удалить этот твит?')) return;

        try {
            await tweetAPI.deleteTweet(postId);
            setPosts(posts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Ошибка удаления твита:', error);
            alert('Не удалось удалить твит');
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#657786',
                }}
            >
                Загрузка постов...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#ff4444',
                }}
            >
                {error}
            </div>
        );
    }

    return (
        <div>
            <h3
                style={{
                    marginBottom: '20px',
                    color: '#1da1f2',
                    fontSize: '24px',
                }}
            >
                Мои посты ({posts.length})
            </h3>

            {posts.length === 0 ? (
                <div
                    style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#657786',
                        backgroundColor: '#f7f9fa',
                        borderRadius: '12px',
                    }}
                >
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}></p>
                    <p>У вас еще нет твитов</p>
                    <p style={{ fontSize: '14px', marginTop: '5px' }}>
                        Напишите что-нибудь первым!
                    </p>
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
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                        >
                            <p
                                style={{
                                    margin: '0 0 15px 0',
                                    fontSize: '16px',
                                    lineHeight: '1.4',
                                    wordBreak: 'break-word',
                                    textAlign: 'left',
                                }}
                            >
                                {post.content}
                            </p>
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
                                                            'scale(1.02)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform =
                                                            'scale(1)';
                                                    }}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            <div>
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

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    color: '#657786',
                                }}
                            >
                                <span>
                                    {' '}
                                    {new Date(post.createdAt).toLocaleString(
                                        'ru-RU'
                                    )}
                                </span>

                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPosts;
