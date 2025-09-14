// pages/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileAPI, tweetAPI } from '../services/api';
import '../styles/Profile.css';

interface UserProfile {
    id: number;
    username: string;
    info?: string;
    birthdate?: string;
    avatar?: string;
    createdAt?: string;
}

interface Tweet {
    id: number;
    content: string;
    createdAt: string;
    images: string[];
    likesCount: number;
    isLiked?: boolean;
    user?: {
        id: number;
        username: string;
        avatar?: string;
    };
}

interface UserProfileResponse {
    user: UserProfile;
    posts: Tweet[];
}

const UserProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                setError('');

                const response = await profileAPI.getUserProfile(
                    Number(userId)
                );
                console.log('📦 Данные с бэкенда:', response);

                setUser(response.user);
                setPosts(response.posts || []);
            } catch (err: any) {
                console.error('❌ Ошибка загрузки профиля:', err);
                setError(
                    err.response?.data?.error || 'Ошибка при загрузке профиля'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [userId]);

    const formatBirthdate = (birthdate: string | undefined) => {
        if (!birthdate) return 'Не указана';

        const date = new Date(birthdate);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const calculateAge = (birthdate: string | undefined) => {
        if (!birthdate) return null;

        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
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
        <div className='profile-container'>
            <div className='profile-layout'>
                {/* Левая колонка - информация о пользователе */}
                <div className='profile-sidebar'>
                    <div className='user-card'>
                        <div className='user-avatar'>
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className='avatar-image'
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className='avatar-fallback'>
                                    {user.username?.charAt(0)?.toUpperCase() ||
                                        'U'}
                                </span>
                            )}
                        </div>

                        <h2 className='username'>@{user.username}</h2>

                        <div className='user-info'>
                            {/* Дата рождения */}
                            {user.birthdate && (
                                <div className='info-item'>
                                    <span className='label'>
                                        🎂 Дата рождения:
                                    </span>
                                    <span className='value'>
                                        {formatBirthdate(user.birthdate)}
                                        {user.birthdate && (
                                            <span
                                                style={{
                                                    marginLeft: '8px',
                                                    color: '#657786',
                                                }}
                                            >
                                                ({calculateAge(user.birthdate)}{' '}
                                                лет)
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}

                            {/* Описание профиля */}
                            {user.info && (
                                <div
                                    className='info-item'
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <span
                                        className='label'
                                        style={{ marginBottom: '5px' }}
                                    >
                                        📝 О себе:
                                    </span>
                                    <span
                                        className='value'
                                        style={{
                                            fontStyle: 'italic',
                                            lineHeight: '1.4',
                                            color: '#2d3748',
                                        }}
                                    >
                                        {user.info}
                                    </span>
                                </div>
                            )}

                            {/* Дата регистрации */}
                            {user.createdAt && (
                                <div className='info-item'>
                                    <span className='label'>
                                        📅 Регистрация:
                                    </span>
                                    <span className='value'>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                            )}

                            {/* Количество постов */}
                            <div className='info-item'>
                                <span className='label'>📝 Постов:</span>
                                <span className='value'>{posts.length}</span>
                            </div>
                        </div>

                        <Link to='/home' className='back-btn'>
                            ← Назад к ленте
                        </Link>
                    </div>
                </div>

                {/* Правая колонка - посты пользователя */}
                <div className='profile-content'>
                    <h3
                        style={{
                            marginBottom: '25px',
                            color: '#1da1f2',
                            fontSize: '24px',
                            fontWeight: 'bold',
                        }}
                    >
                        Посты пользователя ({posts.length})
                    </h3>

                    {posts.length === 0 ? (
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
                            <div
                                style={{
                                    fontSize: '48px',
                                    marginBottom: '15px',
                                }}
                            >
                                🌅
                            </div>
                            <h3
                                style={{
                                    margin: '0 0 10px 0',
                                    color: '#14171a',
                                }}
                            >
                                Нет постов
                            </h3>
                            <p style={{ margin: 0, fontSize: '16px' }}>
                                Пользователь еще не опубликовал ни одного поста
                            </p>
                        </div>
                    ) : (
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
                                    {/* Шапка поста */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '16px',
                                            gap: '12px',
                                        }}
                                    >
                                        {/* Аватар пользователя */}
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.username}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        'none';
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
                                                {user.username
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
                                                    @{user.username}
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

                                    {/* Содержание поста */}
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

                                    {/* Блок изображений */}
                                    {post.images && post.images.length > 0 && (
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns:
                                                    post.images.length === 1
                                                        ? '1fr'
                                                        : post.images.length ===
                                                          2
                                                        ? 'repeat(2, 1fr)'
                                                        : 'repeat(3, 1fr)',
                                                gap: '4px',
                                                marginBottom: '16px',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {post.images.map(
                                                (
                                                    image: string,
                                                    index: number
                                                ) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            position:
                                                                'relative',
                                                            cursor: 'pointer',
                                                            overflow: 'hidden',
                                                            aspectRatio: '1',
                                                        }}
                                                        onClick={() =>
                                                            setExpandedImage(
                                                                image
                                                            )
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
                                                                objectFit:
                                                                    'cover',
                                                                transition:
                                                                    'transform 0.2s',
                                                            }}
                                                            onMouseEnter={(
                                                                e
                                                            ) => {
                                                                e.currentTarget.style.transform =
                                                                    'scale(1.02)';
                                                            }}
                                                            onMouseLeave={(
                                                                e
                                                            ) => {
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

                                    {/* Кнопка лайка */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
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
                                                gap: '6px',
                                                padding: '6px 12px',
                                                border: 'none',
                                                borderRadius: '20px',
                                                backgroundColor: post.isLiked
                                                    ? '#ffe6ea'
                                                    : '#f7f9fa',
                                                color: post.isLiked
                                                    ? '#e0245e'
                                                    : '#657786',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    post.isLiked
                                                        ? '#ffd1d9'
                                                        : '#e1e8ed';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    post.isLiked
                                                        ? '#ffe6ea'
                                                        : '#f7f9fa';
                                            }}
                                        >
                                            <span style={{ fontSize: '16px' }}>
                                                {post.isLiked ? '❤️' : '🤍'}
                                            </span>
                                            <span
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {post.likesCount}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

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
                                alt='Увеличенное изображение'
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
            </div>
        </div>
    );
};

export default UserProfile;
