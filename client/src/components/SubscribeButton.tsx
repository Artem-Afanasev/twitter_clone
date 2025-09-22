import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';

interface SubscribeButtonProps {
    targetUserId: number;
    onSubscriptionChange?: (subscribed: boolean) => void;
    variant?: 'default' | 'small';
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
    targetUserId,
    onSubscriptionChange,
    variant = 'default',
}) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkSubscription();
    }, [targetUserId]);

    const checkSubscription = async () => {
        try {
            const response = await subscriptionAPI.checkSubscription(
                targetUserId
            );
            setIsSubscribed(response.subscribed);
        } catch (err: any) {
            console.error('Ошибка проверки подписки:', err);
        }
    };

    const handleSubscribe = async () => {
        try {
            setIsLoading(true);
            setError('');

            if (isSubscribed) {
                await subscriptionAPI.unsubscribe(targetUserId);
                setIsSubscribed(false);
                onSubscriptionChange?.(false);
            } else {
                await subscriptionAPI.subscribe(targetUserId);
                setIsSubscribed(true);
                onSubscriptionChange?.(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при подписке');
            console.error('Ошибка подписки:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === 'small') {
        return (
            <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`subscribe-btn-small ${
                    isSubscribed ? 'unsubscribe' : 'subscribe'
                }`}
                style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    borderRadius: '15px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    backgroundColor: isSubscribed ? '#e1e8ed' : '#1da1f2',
                    color: isSubscribed ? '#657786' : 'white',
                    fontWeight: 'bold',
                    opacity: isLoading ? 0.7 : 1,
                }}
            >
                {isLoading
                    ? '...'
                    : isSubscribed
                    ? '✓ Подписан'
                    : 'Подписаться'}
            </button>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`subscribe-btn ${
                    isSubscribed ? 'unsubscribe' : 'subscribe'
                }`}
                style={{
                    padding: '8px 20px',
                    fontSize: '14px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    backgroundColor: isSubscribed ? '#e1e8ed' : '#1da1f2',
                    color: isSubscribed ? '#657786' : 'white',
                    fontWeight: 'bold',
                    minWidth: '120px',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    if (isSubscribed && !isLoading) {
                        e.currentTarget.style.backgroundColor = '#ffebe8';
                        e.currentTarget.style.color = '#e0245e';
                        e.currentTarget.textContent = 'Отписаться';
                    }
                }}
                onMouseLeave={(e) => {
                    if (isSubscribed && !isLoading) {
                        e.currentTarget.style.backgroundColor = '#e1e8ed';
                        e.currentTarget.style.color = '#657786';
                        e.currentTarget.textContent = '✓ Подписан';
                    }
                }}
            >
                {isLoading
                    ? '...'
                    : isSubscribed
                    ? '✓ Подписан'
                    : 'Подписаться'}
            </button>

            {error && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        color: '#e0245e',
                        fontSize: '12px',
                        marginTop: '4px',
                        textAlign: 'center',
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default SubscribeButton;
