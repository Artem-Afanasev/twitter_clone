// pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { profileAPI, User } from '../services/api';
import CreatePost from '../components/CreatePost';
import UserPosts from '../components/UserPosts';
import '../styles/Profile.css';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
            setUser(response.user);
            setFormData({
                username: response.user.username,
                email: response.user.email,
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
                formData.email
            );
            setUser(response.user);
            setEditMode(false);
            setMessage('✅ Профиль успешно обновлен!');

            // Обновляем данные в localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.username = response.user.username;
                userData.email = response.user.email;
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
                        <div className="user-avatar">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
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
