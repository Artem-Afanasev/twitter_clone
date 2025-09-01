// pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { profileAPI, User } from '../services/api';
import CreatePost from '../components/CreatePost';
import UserPosts from '../components/UserPosts';
import '../styles/Profile.css';

// Создаем расширенный интерфейс с avatar
interface UserWithAvatar extends User {
    avatar?: string;
}

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

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getProfile();
            const userData = response.user as UserWithAvatar;
            setUser(userData);
            setFormData({
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar || '',
            });
        } catch (error: any) {
            setMessage(
                `❌ Ошибка: ${error.response?.data?.error || error.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await profileAPI.updateProfile(
                formData.username,
                formData.email,
                formData.avatar || undefined // Отправляем undefined если пустая строка
            );
            const updatedUser = response.user as UserWithAvatar;
            setUser(updatedUser);
            setEditMode(false);
            setMessage('✅ Профиль успешно обновлен!');

            // Обновляем данные в localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.username = updatedUser.username;
                userData.email = updatedUser.email;
                userData.avatar = updatedUser.avatar;
                localStorage.setItem('user', JSON.stringify(userData));
            }
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
                        {/* Заменяем букву на аватар */}
                        <div className="user-avatar">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="avatar-image"
                                    onError={(e) => {
                                        // Если изображение не загружается, показываем букву
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

                    {/* Форма редактирования */}
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
                                    <label>URL аватара:</label>
                                    <input
                                        type="url"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                    <small
                                        style={{
                                            color: '#657786',
                                            fontSize: '12px',
                                        }}
                                    >
                                        Оставьте пустым для аватара по умолчанию
                                    </small>
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
                    {/* Создание нового поста */}
                    <CreatePost />

                    {/* Лента постов пользователя */}
                    {user && <UserPosts />}
                </div>
            </div>

            {/* Сообщения */}
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
