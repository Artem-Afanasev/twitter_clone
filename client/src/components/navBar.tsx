// components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <nav
            style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #dee2e6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div>
                <Link
                    to="/profile"
                    style={{
                        marginRight: '1rem',
                        textDecoration: 'none',
                        color: '#007bff',
                    }}
                >
                    Профиль
                </Link>
            </div>
            <div>
                <span style={{ marginRight: '1rem' }}>
                    Привет, {user.username}!
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Выйти
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
