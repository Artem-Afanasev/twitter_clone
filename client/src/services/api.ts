import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Добавляем интерфейсы для типизации ответов
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt?: string;
    avatar?: string;
    postsCount: number;
    birthdate?: string;
    info?: string;
}

export interface UserProfileResponse {
    user: User;
    posts: Tweet[];
}

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
    baseURL: API_URL,
});

export interface PostImage {
    imageUrl: string;
    order: number;
}

export interface Tweet {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user?: User;
    images: string[];
    likesCount: number;
}

export interface CreateTweetResponse {
    message: string;
    tweet: Tweet;
}

export interface Comment {
    id: number;
    comment: string;
    userId: number;
    tweetId: number;
    createdAt: string;
    updatedAt: string;
    User?: User;
}

export interface CreateCommentResponse {
    message: string;
    comment: Comment;
}

export interface LikeResponse {
    message: string;
    likeCount: number;
    likeId?: number;
}

export interface CheckLikeResponse {
    liked: boolean;
    likeId: number | null;
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

    likeTweet: async (postId: number): Promise<LikeResponse> => {
        const response = await api.post<LikeResponse>(`/likes/${postId}/like`);
        return response.data;
    },

    unlikeTweet: async (postId: number): Promise<LikeResponse> => {
        const response = await api.delete<LikeResponse>(
            `/likes/${postId}/like`
        );
        return response.data;
    },

    checkUserLike: async (postId: number): Promise<CheckLikeResponse> => {
        const response = await api.get<CheckLikeResponse>(
            `/likes/${postId}/like`
        );
        return response.data;
    },

    getTweetLikes: async (postId: number): Promise<{ likeCount: number }> => {
        const response = await api.get<{ likeCount: number }>(
            `/likes/${postId}/likes`
        );
        return response.data;
    },

    getUserLikedTweets: async (): Promise<Tweet[]> => {
        const response = await api.get<Tweet[]>('/likes/user/liked-posts');
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

export const subscriptionAPI = {
    getFollowingPosts: async (
        page: number = 1,
        limit: number = 20
    ): Promise<{
        posts: any[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }> => {
        const response = await api.get(
            `/subscriptions/following-posts?page=${page}&limit=${limit}`
        );
        return response.data;
    },
    // Подписаться на пользователя
    subscribe: async (
        targetUserId: number
    ): Promise<{ message: string; subscription: any }> => {
        const response = await api.post('/subscriptions/subscribe', {
            targetUserId,
        });
        return response.data;
    },

    // Отписаться от пользователя
    unsubscribe: async (targetUserId: number): Promise<{ message: string }> => {
        const response = await api.post('/subscriptions/unsubscribe', {
            targetUserId,
        });
        return response.data;
    },

    // Проверить подписку
    checkSubscription: async (
        targetUserId: number
    ): Promise<{ subscribed: boolean }> => {
        const response = await api.get(`/subscriptions/check/${targetUserId}`);
        return response.data;
    },

    // Получить подписчиков
    getFollowers: async (userId?: number): Promise<{ followers: any[] }> => {
        const url = userId
            ? `/subscriptions/followers/${userId}`
            : '/subscriptions/followers';
        const response = await api.get(url);
        return response.data;
    },

    // Получить подписки
    getFollowing: async (userId?: number): Promise<{ following: any[] }> => {
        const url = userId
            ? `/subscriptions/following/${userId}`
            : '/subscriptions/following';
        const response = await api.get(url);
        return response.data;
    },

    // Получить статистику подписок
    getSubscriptionStats: async (
        userId: number
    ): Promise<{ followersCount: number; followingCount: number }> => {
        const response = await api.get(`/subscriptions/stats/${userId}`);
        return response.data;
    },
};

export const commentAPI = {
    // Получить комментарии для твита
    getComments: async (tweetId: number): Promise<Comment[]> => {
        const response = await api.get<Comment[]>(`/comments/${tweetId}`);
        return response.data;
    },

    // Создать комментарий
    createComment: async (
        tweetId: number,
        comment: string
    ): Promise<CreateCommentResponse> => {
        const response = await api.post<CreateCommentResponse>(
            `/comments/${tweetId}`,
            {
                comment,
            }
        );
        return response.data;
    },
};

export const profileAPI = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get<ProfileResponse>('/profile');
        return response.data;
    },

    getUserProfile: async (userId: number): Promise<UserProfileResponse> => {
        const response = await api.get<UserProfileResponse>(
            `/usersprofile/${userId}`
        );
        return response.data;
    },

    updateProfile: async (
        username: string,
        info: string,
        birthdate: string,
        avatarFile?: File
    ): Promise<ProfileResponse> => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('info', info);
        formData.append('birthdate', birthdate);

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
