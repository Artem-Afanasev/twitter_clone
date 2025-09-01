import React, { useState, useRef } from 'react';
import { authAPI, RegisterResponse } from '../services/api'; // ← добавляем импорт типа
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);

            if (avatar) {
                formDataToSend.append('avatar', avatar);
            }

            const response = await fetch(
                'http://localhost:5000/auth/register',
                {
                    method: 'POST',
                    body: formDataToSend,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setMessage(`✅ ${data.message}`);

            // Очищаем форму после успешной регистрации
            setFormData({ username: '', email: '', password: '' });
            setAvatar(null);
            setPreview('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            setMessage(`❌ Ошибка: ${error.message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Проверяем тип файла
            if (!file.type.startsWith('image/')) {
                setMessage('❌ Пожалуйста, выберите изображение');
                return;
            }

            setAvatar(file);

            // Создаем preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatar(null);
        setPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '400px',
                margin: '0 auto',
                paddingTop: '60px',
            }}
        >
            <h2>📝 Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type='text'
                        name='username'
                        placeholder='Имя пользователя'
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <input
                        type='password'
                        name='password'
                        placeholder='Пароль'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        📸 Аватар (необязательно)
                    </label>
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleAvatarChange}
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            width: '100%',
                        }}
                    />

                    {preview && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={preview}
                                alt='Preview'
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                }}
                            />
                            <button
                                type='button'
                                onClick={removeAvatar}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type='submit'
                    style={{
                        padding: '12px 24px',
                        margin: '10px 0',
                        backgroundColor: '#1da1f2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '16px',
                    }}
                >
                    🚀 Зарегистрироваться
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>
                    Уже есть аккаунт?{' '}
                    <Link
                        to='/login'
                        style={{
                            color: '#1da1f2',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        🔑 Войти
                    </Link>
                </p>
            </div>

            {message && (
                <div
                    style={{
                        marginTop: '15px',
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: message.includes('✅')
                            ? '#d4edda'
                            : '#f8d7da',
                        color: message.includes('✅') ? '#155724' : '#721c24',
                        border: `1px solid ${
                            message.includes('✅') ? '#c3e6cb' : '#f5c6cb'
                        }`,
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Register;
