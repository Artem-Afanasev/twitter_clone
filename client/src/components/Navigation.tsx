import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav
            style={{
                padding: '0.6rem 1rem', // Уменьшили вертикальный padding
                backgroundColor: '#1da1f2',
                color: 'white',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                height: '30px', // Фиксированная высота
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                {/* Логотип - ссылка на Home */}
                <Link
                    to="/home"
                    style={{
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span style={{ fontSize: '1.4rem' }}>🐦</span>
                    Twitter Clone
                </Link>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem', // Уменьшили gap
                    }}
                >
                    {/* Имя пользователя (кликабельное для перехода в профиль) */}
                    {user.username && (
                        <span
                            onClick={() => navigate('/profile')}
                            style={{
                                cursor: 'pointer',
                                padding: '0.4rem 0.8rem', // Уменьшили padding
                                borderRadius: '20px',
                                backgroundColor:
                                    location.pathname === '/profile'
                                        ? 'rgba(255,255,255,0.2)'
                                        : 'transparent',
                                transition: 'background-color 0.2s',
                                fontSize: '0.9rem',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    location.pathname === '/profile'
                                        ? 'rgba(255,255,255,0.2)'
                                        : 'transparent';
                            }}
                        >
                            👤 {user.username}
                        </span>
                    )}

                    {/* Кнопка выхода */}
                    {user.id ? (
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 12px', // Уменьшили padding
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid white',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    'transparent';
                            }}
                        >
                            🚪 Выйти
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    color:
                                        location.pathname === '/login'
                                            ? '#ffdd00'
                                            : 'white',
                                    fontWeight:
                                        location.pathname === '/login'
                                            ? 'bold'
                                            : 'normal',
                                    fontSize: '0.9rem',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    backgroundColor:
                                        location.pathname === '/login'
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'transparent',
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
                                            ? '#ffdd00'
                                            : 'white',
                                    fontWeight:
                                        location.pathname === '/register'
                                            ? 'bold'
                                            : 'normal',
                                    fontSize: '0.9rem',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    backgroundColor:
                                        location.pathname === '/register'
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'transparent',
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
