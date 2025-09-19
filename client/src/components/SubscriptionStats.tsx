// components/SubscriptionStats.tsx
import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';

interface SubscriptionStatsProps {
    userId: number;
    onFollowersClick?: () => void;
    onFollowingClick?: () => void;
    showFollowing?: boolean; // Новый проп для отображения подписок
    isCurrentUser?: boolean; // Новый проп для определения текущего пользователя
}

const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({
    userId,
    onFollowersClick,
    onFollowingClick,
    showFollowing = true, // По умолчанию показываем подписки
    isCurrentUser = false, // По умолчанию не текущий пользователь
}) => {
    const [stats, setStats] = useState({
        followersCount: 0,
        followingCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [userId]);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await subscriptionAPI.getSubscriptionStats(userId);
            setStats(response);
        } catch (err: any) {
            console.error('Ошибка загрузки статистики:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    color: '#657786',
                    justifyContent: 'center', // Центрируем
                }}
            >
                <span>...</span>
                {showFollowing && <span>...</span>}
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                gap: '20px',
                fontSize: '14px',
                justifyContent: 'center', // Центрируем
                alignItems: 'center',
            }}
        >
            <span
                onClick={isCurrentUser ? onFollowersClick : undefined}
                style={{
                    cursor:
                        isCurrentUser && onFollowersClick
                            ? 'pointer'
                            : 'default',
                    color:
                        isCurrentUser && onFollowersClick
                            ? '#1da1f2'
                            : '#657786',
                    fontWeight:
                        isCurrentUser && onFollowersClick ? 'bold' : 'normal',
                    textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                    if (isCurrentUser && onFollowersClick) {
                        e.currentTarget.style.textDecoration = 'underline';
                    }
                }}
                onMouseLeave={(e) => {
                    if (isCurrentUser && onFollowersClick) {
                        e.currentTarget.style.textDecoration = 'none';
                    }
                }}
            >
                <strong
                    style={{
                        color: '#14171a',
                        fontWeight: 'bold',
                        display: 'block',
                        fontSize: '16px',
                    }}
                >
                    {stats.followersCount}
                </strong>
                подписчиков
            </span>

            {showFollowing && (
                <span
                    onClick={isCurrentUser ? onFollowingClick : undefined}
                    style={{
                        cursor:
                            isCurrentUser && onFollowingClick
                                ? 'pointer'
                                : 'default',
                        color:
                            isCurrentUser && onFollowingClick
                                ? '#1da1f2'
                                : '#657786',
                        fontWeight:
                            isCurrentUser && onFollowingClick
                                ? 'bold'
                                : 'normal',
                        textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                        if (isCurrentUser && onFollowingClick) {
                            e.currentTarget.style.textDecoration = 'underline';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isCurrentUser && onFollowingClick) {
                            e.currentTarget.style.textDecoration = 'none';
                        }
                    }}
                >
                    <strong
                        style={{
                            color: '#14171a',
                            fontWeight: 'bold',
                            display: 'block',
                            fontSize: '16px',
                        }}
                    >
                        {stats.followingCount}
                    </strong>
                    подписок
                </span>
            )}
        </div>
    );
};

export default SubscriptionStats;
