'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PushNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PushNotificationModal({ isOpen, onClose }: PushNotificationModalProps) {
    const [hasRegistration, setHasRegistration] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            checkPushRegistration();
        }
    }, [isOpen]);

    async function checkPushRegistration() {
        try {
            const response = await fetch('/api/pushregister');
            if (response.ok) {
                const data = await response.json();
                setHasRegistration(data.hasRegistration);
            }
        } catch (error) {
            console.error('Fehler beim Prüfen der Push-Registration:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function subscribePush() {
        setIsSubscribing(true);
        try {
            // Leite direkt zu den Settings weiter statt zu versuchen zu subscriben
            window.location.href = '/settings/notifications';
        } catch (error) {
            console.error('Fehler beim Weiterleiten:', error);
        } finally {
            setIsSubscribing(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" style={{ backgroundColor: 'var(--ios-card-bg)' }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ color: 'var(--ios-text-secondary)' }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔔</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ios-text-primary)' }}>
                        Verpasse keinen Song mehr!
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6" style={{ color: 'var(--ios-text-secondary)' }}>
                        Erhalte sofort Benachrichtigungen, wenn deine Freunde neue Songs teilen. 
                        Sei immer dabei, wenn es neue Musik gibt!
                    </p>

                    {/* Benefits */}
                    <div className="text-left mb-6 space-y-2">
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-sm" style={{ color: 'var(--ios-text-primary)' }}>
                                Sofortige Benachrichtigungen von Freunden
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-sm" style={{ color: 'var(--ios-text-primary)' }}>
                                Nie wieder einen Song verpassen
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-sm" style={{ color: 'var(--ios-text-primary)' }}>
                                Jederzeit abbestellbar
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    {isLoading ? (
                        <div className="py-3 px-4 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">
                            Lade...
                        </div>
                    ) : hasRegistration ? (
                        <div className="py-3 px-4 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            ✅ Bereits aktiviert
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={subscribePush}
                                disabled={isSubscribing}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubscribing ? 'Wird geöffnet...' : '🔔 Zu den Einstellungen'}
                            </button>
                            
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-4 rounded-lg font-medium transition-all"
                                style={{ 
                                    backgroundColor: 'var(--ios-light-gray)', 
                                    color: 'var(--ios-text-secondary)' 
                                }}
                            >
                                Später
                            </button>
                        </div>
                    )}

                    {/* Settings Link */}
                    <p className="text-xs text-gray-500 mt-4" style={{ color: 'var(--ios-text-muted)' }}>
                        Du kannst Benachrichtigungen jederzeit in den 
                        <Link href="/settings/notifications" className="text-purple-600 hover:text-purple-700 underline ml-1">
                            Einstellungen
                        </Link>
                        verwalten.
                    </p>
                </div>
            </div>
        </div>
    );
}
