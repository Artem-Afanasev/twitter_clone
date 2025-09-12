import React, { useState, useRef } from 'react';
import { authAPI, RegisterResponse } from '../services/api';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // ← Добавляем подтверждение пароля
        birthdate: '', // ← Добавляем дату рождения
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // ← Для ошибок валидации
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Функция валидации формы
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Проверка паролей
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        // Проверка даты рождения
        if (formData.birthdate) {
            const birthDate = new Date(formData.birthdate);
            const currentDate = new Date();

            if (birthDate >= currentDate) {
                newErrors.birthdate = 'Дата рождения должна быть в прошлом';
            } else {
                // Проверка возраста (не младше 13 лет)
                const minAgeDate = new Date();
                minAgeDate.setFullYear(currentDate.getFullYear() - 13);

                if (birthDate > minAgeDate) {
                    newErrors.birthdate = 'Вы должны быть старше 13 лет';
                }

                // Проверка возраста (не старше 120 лет)
                const maxAgeDate = new Date();
                maxAgeDate.setFullYear(currentDate.getFullYear() - 120);

                if (birthDate < maxAgeDate) {
                    newErrors.birthdate =
                        'Пожалуйста, укажите реальную дату рождения';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация перед отправкой
        if (!validateForm()) {
            setMessage('❌ Пожалуйста, исправьте ошибки в форме');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('birthdate', formData.birthdate); // ← Добавляем дату рождения

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
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                birthdate: '',
            });
            setAvatar(null);
            setPreview('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setErrors({});
        } catch (error: any) {
            setMessage(`❌ Ошибка: ${error.message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage('❌ Пожалуйста, выберите изображение');
                return;
            }

            setAvatar(file);

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
                {/* Поле имени пользователя */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя пользователя"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: errors.username
                                ? '1px solid #ff4444'
                                : '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    {errors.username && (
                        <span style={{ color: '#ff4444', fontSize: '12px' }}>
                            {errors.username}
                        </span>
                    )}
                </div>

                {/* Поле email */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: errors.email
                                ? '1px solid #ff4444'
                                : '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    {errors.email && (
                        <span style={{ color: '#ff4444', fontSize: '12px' }}>
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* Поле пароля */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: errors.password
                                ? '1px solid #ff4444'
                                : '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    {errors.password && (
                        <span style={{ color: '#ff4444', fontSize: '12px' }}>
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Подтверждение пароля */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Подтвердите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: errors.confirmPassword
                                ? '1px solid #ff4444'
                                : '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    {errors.confirmPassword && (
                        <span style={{ color: '#ff4444', fontSize: '12px' }}>
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>

                {/* Поле даты рождения */}
                <div style={{ marginBottom: '15px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold',
                        }}
                    >
                        📅 Дата рождения
                    </label>
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            width: '100%',
                            border: errors.birthdate
                                ? '1px solid #ff4444'
                                : '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    {errors.birthdate && (
                        <span style={{ color: '#ff4444', fontSize: '12px' }}>
                            {errors.birthdate}
                        </span>
                    )}
                </div>

                {/* Поле аватара */}
                <div style={{ marginBottom: '15px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold',
                        }}
                    >
                        📸 Аватар (необязательно)
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
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
                                alt="Preview"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                }}
                            />
                            <button
                                type="button"
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
                    type="submit"
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
                        to="/login"
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
