import React, { useState } from 'react';
import { authAPI, RegisterResponse } from '../services/api'; // ← добавляем импорт типа

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response: RegisterResponse = await authAPI.register(
                // ← указываем тип
                formData.username,
                formData.email,
                formData.password
            );
            setMessage(`✅ ${response.message}`);
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

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
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
                        padding: '8px',
                        width: '100%',
                    }}
                />
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
                        padding: '8px',
                        width: '100%',
                    }}
                />
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
                        padding: '8px',
                        width: '100%',
                    }}
                />
                <button
                    type="submit"
                    style={{ padding: '10px 20px', margin: '10px 0' }}
                >
                    Зарегистрироваться
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
