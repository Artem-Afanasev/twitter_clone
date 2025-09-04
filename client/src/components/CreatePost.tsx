// components/CreatePost.tsx
import React, { useState, useRef } from 'react';
import { api } from '../services/api';

const CreatePost: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [status, setStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() && selectedImages.length === 0) {
            setErrorMessage('Твит должен содержать текст или изображение');
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
            const formData = new FormData();
            formData.append('content', content);

            // Добавляем все изображения
            selectedImages.forEach((image, index) => {
                formData.append('images', image);
            });

            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Сброс формы
            setContent('');
            setSelectedImages([]);
            setImagePreviews([]);
            setStatus('success');

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error: any) {
            // обработка ошибок
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        const validPreviews: string[] = [];

        files.forEach((file) => {
            if (!file.type.startsWith('image/')) {
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            validFiles.push(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                validPreviews.push(e.target?.result as string);
                if (validPreviews.length === files.length) {
                    setImagePreviews((prev) => [...prev, ...validPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages((prev) => [...prev, ...validFiles]);
        setStatus('idle');
        setErrorMessage('');
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

                {/* Превью изображения */}
                {imagePreviews.map((preview, index) => (
                    <div
                        key={index}
                        style={{ marginBottom: '10px', position: 'relative' }}
                    >
                        <img
                            src={preview}
                            alt={`Превью ${index + 1}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                border: '1px solid #e1e8ed',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Кнопка выбора файла */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e1e8ed',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#1da1f2',
                        }}
                    >
                        📷 Добавить фото
                    </label>
                </div>

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
                    disabled={
                        status === 'loading' ||
                        (!content.trim() && selectedImages.length === 0)
                    }
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
