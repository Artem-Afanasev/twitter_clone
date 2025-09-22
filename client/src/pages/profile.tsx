import React, { useState, useEffect } from 'react';
import { profileAPI, User, subscriptionAPI } from '../services/api';
import CreatePost from '../components/CreatePost';
import UserPosts from '../components/UserPosts';
import LikedPosts from '../components/LikedPosts';
import SubscriptionStats from '../components/SubscriptionStats';
import '../styles/Profile.css';
import FollowingPosts from '../components/FollowingPosts';

interface UserWithProfile extends User {
    avatar?: string;
    birthdate?: string;
    info?: string;
}

type ProfileTab = 'posts' | 'liked' | 'following';

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserWithProfile | null>(null);
    const [subscriptionStats, setSubscriptionStats] = useState({
        followersCount: 0,
        followingCount: 0,
    });
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        info: '',
        birthdate: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            console.log(' Fetching profile...');
            const response = await profileAPI.getProfile();
            console.log(' API Response:', response);

            const userData = response.user as UserWithProfile;
            setUser(userData);
            setFormData({
                username: userData.username,
                info: userData.info || '',
                birthdate: userData.birthdate
                    ? userData.birthdate.split('T')[0]
                    : '',
            });
            const statsResponse = await subscriptionAPI.getSubscriptionStats(
                userData.id
            );
            setSubscriptionStats(statsResponse);
        } catch (error: any) {
            console.error(' Profile fetch error:', error);
            setMessage(
                ` Ошибка: ${error.response?.data?.error || error.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await profileAPI.updateProfile(
                formData.username,
                formData.info,
                formData.birthdate,
                avatarFile || undefined
            );
            const updatedUser = response.user as UserWithProfile;

            setUser(updatedUser);
            setEditMode(false);
            setMessage(' Профиль успешно обновлен!');

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.username = updatedUser.username;
                userData.info = updatedUser.info;
                userData.birthdate = updatedUser.birthdate;
                userData.avatar = updatedUser.avatar;
                localStorage.setItem('user', JSON.stringify(userData));
            }

            setAvatarFile(null);
            setAvatarPreview(null);
            fetchProfile();
        } catch (error: any) {
            setMessage(
                ` Ошибка: ${error.response?.data?.error || error.message}`
            );
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

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

    if (loading) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#657786',
                    paddingTop: '50px',
                }}
            >
                Загрузка профиля...
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-layout">
                <div className="profile-sidebar">
                    <div className="user-card">
                        <div className="user-avatar">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="avatar-image"
                                    onError={(e) => {
                                        console.error(
                                            ' Image failed to load:',
                                            user.avatar
                                        );
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className="avatar-fallback">
                                    {user?.username?.charAt(0).toUpperCase() ||
                                        'U'}
                                </span>
                            )}
                        </div>

                        <h2 className="username">@{user?.username}</h2>

                        <div style={{ marginBottom: '15px' }}>
                            <SubscriptionStats
                                userId={user?.id || 0}
                                onFollowersClick={() =>
                                    console.log('Show my followers modal')
                                }
                                onFollowingClick={() =>
                                    console.log('Show my following modal')
                                }
                                showFollowing={true}
                                isCurrentUser={true}
                            />
                        </div>

                        <div className="user-info">
                            <div className="info-item">
                                <span className="label"> Дата рождения:</span>
                                <span className="value">
                                    {formatBirthdate(user?.birthdate)}
                                    {user?.birthdate && (
                                        <span
                                            style={{
                                                marginLeft: '8px',
                                                color: '#657786',
                                            }}
                                        >
                                            ({calculateAge(user.birthdate)} лет)
                                        </span>
                                    )}
                                </span>
                            </div>

                            {user?.info && (
                                <div
                                    className="info-item"
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <span
                                        className="label"
                                        style={{ marginBottom: '5px' }}
                                    >
                                        О себе:
                                    </span>
                                    <span
                                        className="value"
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
                            <div className="info-item">
                                <span className="label"> Регистрация:</span>
                                <span className="value">
                                    {user?.createdAt
                                        ? new Date(
                                              user.createdAt
                                          ).toLocaleDateString('ru-RU')
                                        : 'Неизвестно'}
                                </span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button
                                onClick={() => setEditMode(true)}
                                className="edit-btn"
                            >
                                ✏️ Редактировать профиль
                            </button>

                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Выйти
                            </button>
                        </div>
                    </div>

                    {editMode && (
                        <div className="edit-form">
                            <h3>✏️ Редактирование профиля</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Имя пользователя:</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label> Дата рождения:</label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                    />
                                    <small
                                        style={{
                                            color: '#657786',
                                            fontSize: '12px',
                                        }}
                                    >
                                        Необязательно
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label> О себе:</label>
                                    <textarea
                                        name="info"
                                        value={formData.info}
                                        onChange={handleChange}
                                        placeholder="Расскажите немного о себе..."
                                        rows={3}
                                        maxLength={250}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <small
                                        style={{
                                            color: '#657786',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {formData.info.length}/250 символов
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>Аватар:</label>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleFileChange}
                                    />
                                    <small
                                        style={{
                                            color: '#657786',
                                            fontSize: '12px',
                                        }}
                                    >
                                        Выберите файл с компьютера
                                    </small>

                                    {avatarPreview && (
                                        <div style={{ marginTop: '10px' }}>
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-buttons">
                                    <button type="submit" className="save-btn">
                                        Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                username: user?.username || '',
                                                info: user?.info || '',
                                                birthdate: user?.birthdate
                                                    ? user.birthdate.split(
                                                          'T'
                                                      )[0]
                                                    : '',
                                            });
                                        }}
                                        className="cancel-btn"
                                    >
                                        ❌ Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div className="profile-content">
                    <div className="profile-tabs">
                        <button
                            className={`tab-button ${
                                activeTab === 'posts' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('posts')}
                        >
                            📝 Мои посты
                        </button>
                        <button
                            className={`tab-button ${
                                activeTab === 'following' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('following')}
                        >
                            👥 Подписки
                        </button>
                        <button
                            className={`tab-button ${
                                activeTab === 'liked' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('liked')}
                        >
                            ❤️ Лайкнутые
                        </button>
                    </div>

                    {activeTab === 'posts' && <CreatePost />}

                    {activeTab === 'posts' && <UserPosts />}
                    {activeTab === 'following' && <FollowingPosts />}
                    {activeTab === 'liked' && <LikedPosts />}
                </div>
            </div>

            {message && (
                <div
                    className={`message ${
                        message.includes('✅') ? 'success' : 'error'
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Profile;
