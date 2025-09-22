import React, { useState } from 'react';
import { authAPI, AuthResponse } from '../services/api';
import { Link } from 'react-router-dom';

interface LoginProps {
    onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response: AuthResponse = await authAPI.login(
                formData.email,
                formData.password
            );
            onLogin(response.token, response.user);
            setMessage(' Успешный вход!');
        } catch (error: any) {
            setMessage(
                ` Ошибка: ${error.response?.data?.error || error.message}`
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
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
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
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p>
                        Нет аккаунта?
                        <Link
                            to="/register"
                            style={{
                                marginLeft: '5px',
                                color: '#007bff',
                                textDecoration: 'none',
                            }}
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
                <button
                    type="submit"
                    style={{ padding: '10px 20px', margin: '10px 0' }}
                >
                    Войти
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
