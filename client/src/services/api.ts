import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Добавляем интерфейсы для типизации ответов
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: API_URL,
});

// Добавляем интерцептор для автоматической подстановки токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
    user?: User;
}

export interface ProfileResponse {
    message: string;
    user: User;
}

export const authAPI = {
    register: async (
        username: string,
        email: string,
        password: string
    ): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>( // ← Используем api вместо axios
            '/auth/register', // ← Только путь, без полного URL
            { username, email, password }
        );
        return response.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>( // ← Используем api вместо axios
            '/auth/login', // ← Только путь, без полного URL
            { email, password }
        );
        return response.data;
    },
};

export const profileAPI = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get<ProfileResponse>('/profile');
        return response.data;
    },

    updateProfile: async (
        username: string,
        email: string
    ): Promise<ProfileResponse> => {
        const response = await api.put<ProfileResponse>('/profile', {
            username,
            email,
        });
        return response.data;
    },
};
