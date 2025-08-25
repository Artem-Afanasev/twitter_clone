import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Восстанавливаем пользователя из localStorage при загрузке
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (token: string, userData: any) => {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/profile" replace />
                            ) : (
                                <Login onLogin={handleLogin} />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            user ? (
                                <Navigate to="/profile" replace />
                            ) : (
                                <Register />
                            )
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/profile" />} />
                    <Route
                        path="*"
                        element={
                            <div style={{ padding: '20px' }}>
                                <h2>404 - Страница не найдена</h2>
                                <p>
                                    Перейти на{' '}
                                    <a href="/login">страницу входа</a>
                                </p>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
