// pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { profileAPI, User } from '../services/api';
import CreatePost from '../components/CreatePost';
import UserPosts from '../components/UserPosts';
import LikedPosts from '../components/LikedPosts'; // ← Добавляем импорт
import '../styles/Profile.css';

// Создаем расширенный интерфейс с avatar
interface UserWithAvatar extends User {
    avatar?: string;
}

// Тип для вкладок
type ProfileTab = 'posts' | 'liked';

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserWithAvatar | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatar: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts'); // ← Добавляем состояние активной вкладки

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching profile...');
            const response = await profileAPI.getProfile();
            console.log('✅ API Response:', response);

            const userData = response.user as UserWithAvatar;
            setUser(userData);
            setFormData({
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar || '',
            });
        } catch (error: any) {
            console.error('❌ Profile fetch error:', error);
            setMessage(
                `❌ Ошибка: ${error.response?.data?.error || error.message}`
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
                formData.email,
                avatarFile || undefined
            );
            const updatedUser = response.user as UserWithAvatar;

            setUser(updatedUser);
            setEditMode(false);
            setMessage('✅ Профиль успешно обновлен!');

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.username = updatedUser.username;
                userData.email = updatedUser.email;
                userData.avatar = updatedUser.avatar;
                localStorage.setItem('user', JSON.stringify(userData));
            }

            setAvatarFile(null);
            setAvatarPreview(null);
            fetchProfile();
        } catch (error: any) {
            setMessage(
                `❌ Ошибка: ${error.response?.data?.error || error.message}`
            );
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                {/* Левая колонка - информация о пользователе */}
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
                                            '❌ Image failed to load:',
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

                        <div className="user-info">
                            <div className="info-item">
                                <span className="label">📧 Email:</span>
                                <span className="value">{user?.email}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">🆔 ID:</span>
                                <span className="value">#{user?.id}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">📅 Регистрация:</span>
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
                                ✏️ Редактировать
                            </button>

                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                🚪 Выйти
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
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
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
                                        💾 Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                username: user?.username || '',
                                                email: user?.email || '',
                                                avatar: user?.avatar || '',
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

                {/* Правая колонка - посты */}
                <div className="profile-content">
                    {/* Навигационные табы */}
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
                                activeTab === 'liked' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('liked')}
                        >
                            ❤️ Лайкнутые посты
                        </button>
                    </div>

                    {/* Создание нового поста (только на вкладке "Мои посты") */}
                    {activeTab === 'posts' && <CreatePost />}

                    {/* Контент в зависимости от активной вкладки */}
                    {activeTab === 'posts' ? <UserPosts /> : <LikedPosts />}
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
