// components/CreatePost.tsx
import React, { useState } from 'react';
import { api } from '../services/api';

const CreatePost: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [status, setStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setErrorMessage('Текст твита не может быть пустым');
            setStatus('error');
            return;
        }

        if (content.length > 280) {
            setErrorMessage('Твит не может превышать 280 символов');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await api.post('/posts', { content });

            setContent('');
            setStatus('success');

            // 🔥 ПЕРЕЗАГРУЗКА СТРАНИЦЫ ДЛЯ ОБНОВЛЕНИЯ СПИСКА
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            console.log('Твит создан:', response.data);
        } catch (error: any) {
            setStatus('error');
            if (error.response?.data?.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Ошибка при создании твита');
            }
            console.error('Ошибка создания твита:', error);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);

        if (status === 'error') {
            setStatus('idle');
            setErrorMessage('');
        }
    };

    return (
        <div
            style={{
                padding: '20px',
                border: '1px solid #e1e8ed',
                borderRadius: '12px',
                backgroundColor: 'white',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <form onSubmit={handleSubmit}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1da1f2' }}>
                    💬 Создать новый твит
                </h3>

                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Что происходит?"
                    rows={4}
                    maxLength={280}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${
                            status === 'error'
                                ? '#ff4444'
                                : status === 'success'
                                ? '#00C851'
                                : '#e1e8ed'
                        }`,
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '100px',
                        boxSizing: 'border-box',
                        marginBottom: '10px',
                    }}
                    disabled={status === 'loading'}
                />

                <div
                    style={{
                        textAlign: 'right',
                        marginBottom: '15px',
                        color: content.length > 260 ? '#ff4444' : '#657786',
                        fontSize: '14px',
                    }}
                >
                    {content.length}/280
                </div>

                {status === 'error' && (
                    <div
                        style={{
                            color: '#ff4444',
                            backgroundColor: '#ffebee',
                            padding: '10px',
                            borderRadius: '6px',
                            marginBottom: '15px',
                            fontSize: '14px',
                        }}
                    >
                        ⚠️ {errorMessage}
                    </div>
                )}

                {status === 'success' && (
                    <div
                        style={{
                            color: '#00C851',
                            backgroundColor: '#e8f5e8',
                            padding: '10px',
                            borderRadius: '6px',
                            marginBottom: '15px',
                            fontSize: '14px',
                        }}
                    >
                        ✅ Твит успешно создан! Обновляем...
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading' || !content.trim()}
                    style={{
                        backgroundColor:
                            status === 'loading' ? '#99c7f2' : '#1da1f2',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '24px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor:
                            status === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: status === 'loading' ? 0.7 : 1,
                        width: '100%',
                    }}
                >
                    {status === 'loading'
                        ? '⏳ Публикация...'
                        : '🐦 Опубликовать твит'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
