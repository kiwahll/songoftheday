'use client';

import { useEffect, useState, SubmitEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import PushNotificationModal from '@/components/PushNotificationModal';

export default function AddSongPage() {
    const [songUrl, setSongUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPushModal, setShowPushModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const text = params.get('text');
        if (text) setSongUrl(text);
    }, []);

    async function checkPushRegistration(): Promise<boolean> {
        try {
            const response = await fetch('/api/pushregister');
            if (response.ok) {
                const data = await response.json();
                return data.hasRegistration;
            }
        } catch (error) {
            console.error('Fehler beim Prüfen der Push-Registration:', error);
        }
        return false;
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/song/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                const hasRegistration = await checkPushRegistration();
                if (hasRegistration) {
                    router.push('/');
                } else {
                    setShowPushModal(true);
                }
            } else {
                // Fehler anzeigen
                setError(data.error || 'Ein Fehler ist aufgetreten');
            }
        } catch (err) {
            setError('Netzwerkfehler - bitte versuche es erneut');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            {/* Back Button */}
            <div className="p-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors" style={{ color: 'var(--ios-text-secondary)' }}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Zurück
                </Link>
            </div>

            {/* Content */}
            <div className="max-w-md mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ color: 'var(--ios-text-primary)' }}>Song hinzufügen</h1>
                    <p className="text-gray-600" style={{ color: 'var(--ios-text-secondary)' }}>Füge deinen Song des Tages hinzu</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Field */}
                    <div>
                        <label htmlFor="songUrl" className="block text-sm font-medium text-gray-700 mb-2" style={{ color: 'var(--ios-text-secondary)' }}>
                            Song URL
                        </label>
                        <input
                            type="url"
                            id="songUrl"
                            value={songUrl}
                            onChange={(e) => setSongUrl(e.target.value)}
                            placeholder="https://open.spotify.com/track/..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" style={{ backgroundColor: 'var(--ios-input-bg)', borderColor: 'var(--ios-input-border)', color: 'var(--ios-text-primary)' }}
                            required
                        />
                        <p className="mt-2 text-sm text-gray-500" style={{ color: 'var(--ios-text-muted)' }}>
                            Kopiere die Spotify URL und füge sie hier ein
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !songUrl.trim()}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? 'Wird hinzugefügt...' : 'Song hinzufügen'}
                    </button>
                </form>

                {/* Help Section */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: 'var(--ios-light-gray)' }}>
                    <h3 className="font-medium text-gray-900 mb-2" style={{ color: 'var(--ios-text-primary)' }}>Wie finde ich die Spotify URL?</h3>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside" style={{ color: 'var(--ios-text-secondary)' }}>
                        <li>Öffne den Song in der Spotify App</li>
                        <li>Klicke auf "Teilen"</li>
                        <li>Klicke auf "Kopieren"</li>
                        <li>Füge die URL hier ein</li>
                    </ol>
                </div>
            </div>

            {/* Push Notification Modal */}
            <PushNotificationModal
                isOpen={showPushModal}
                onClose={() => router.push('/')}
            />
        </main>
    );
}
