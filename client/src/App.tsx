import Home from './pages/Home';
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
import Navigation from './components/Navigation'; // ← Добавляем импорт
import './App.css';

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
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

    return (
        <Router>
            <div className="App">
                {/* Добавляем навигацию */}
                <Navigation />

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
                            <div
                                style={{ padding: '20px', paddingTop: '60px' }}
                            >
                                <h2>404 - Страница не найдена</h2>
                                <p>
                                    Перейти на{' '}
                                    <a href="/home">домашнюю страницу</a>
                                </p>
                            </div>
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
