// pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { profileAPI, User } from '../services/api';

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
        return <div style={{ padding: '20px' }}>Загрузка...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <h2>Профиль пользователя</h2>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Выйти
                </button>
            </div>

            {!editMode ? (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <p>
                            <strong>ID:</strong> {user?.id}
                        </p>
                        <p>
                            <strong>Имя пользователя:</strong> {user?.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={() => setEditMode(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Редактировать профиль
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            Имя пользователя:
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{
                                padding: '8px',
                                width: '100%',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                padding: '8px',
                                width: '100%',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Сохранить
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
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            {message && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: message.includes('✅')
                            ? '#d4edda'
                            : '#f8d7da',
                        border: `1px solid ${
                            message.includes('✅') ? '#c3e6cb' : '#f5c6cb'
                        }`,
                        borderRadius: '4px',
                        color: message.includes('✅') ? '#155724' : '#721c24',
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Profile;
