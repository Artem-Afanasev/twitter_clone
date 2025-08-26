import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <nav
            style={{
                padding: '1rem',
                backgroundColor: '#f0f0f0',
                borderBottom: '1px solid #ccc',
                marginBottom: '2rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                <div>
                    <Link
                        to="/profile"
                        style={{
                            marginRight: '1rem',
                            textDecoration: 'none',
                            color:
                                location.pathname === '/profile'
                                    ? '#007bff'
                                    : '#333',
                            fontWeight:
                                location.pathname === '/profile'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    >
                        🏠 Профиль
                    </Link>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    {user.username && (
                        <span style={{ marginRight: '1rem' }}>
                            👤 {user.username}
                        </span>
                    )}

                    {user.id ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            🚪 Выйти
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    marginRight: '1rem',
                                    textDecoration: 'none',
                                    color:
                                        location.pathname === '/login'
                                            ? '#007bff'
                                            : '#333',
                                    fontWeight:
                                        location.pathname === '/login'
                                            ? 'bold'
                                            : 'normal',
                                }}
                            >
                                🔑 Войти
                            </Link>
                            <Link
                                to="/register"
                                style={{
                                    textDecoration: 'none',
                                    color:
                                        location.pathname === '/register'
                                            ? '#007bff'
                                            : '#333',
                                    fontWeight:
                                        location.pathname === '/register'
                                            ? 'bold'
                                            : 'normal',
                                }}
                            >
                                📝 Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
