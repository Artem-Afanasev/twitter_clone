import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Добавляем интерфейсы для типизации ответов
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
    avatar?: string;
}

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
    baseURL: API_URL,
});

export interface Tweet {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user?: User;
}

export interface CreateTweetResponse {
    message: string;
    tweet: Tweet;
}

// Добавим в объект api методы для работы с твитами
export const tweetAPI = {
    createTweet: async (content: string): Promise<CreateTweetResponse> => {
        const response = await api.post<CreateTweetResponse>('/posts', {
            content,
        });
        return response.data;
    },

    // Получение постов ТЕКУЩЕГО пользователя
    getMyTweets: async (): Promise<Tweet[]> => {
        const response = await api.get<Tweet[]>('/posts/my-posts');
        return response.data;
    },

    deleteTweet: async (id: number): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },

    getUserTweets: async (userId: number): Promise<Tweet[]> => {
        const response = await api.get<Tweet[]>(`/tweets/user/${userId}`);
        return response.data;
    },

    // Метод для получения всех твитов (если нужно)
    getAllTweets: async (): Promise<Tweet[]> => {
        const response = await api.get<Tweet[]>('/home');
        return response.data;
    },
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Для FormData не устанавливаем Content-Type - браузер сделает это сам
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
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
        email: string,
        avatarFile?: File // Меняем на File вместо string
    ): Promise<ProfileResponse> => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const response = await api.put<ProfileResponse>('/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
