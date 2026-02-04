'use client';

import { useEffect, useState, SubmitEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function AddSongPage() {
    const [spotifyUrl, setSpotifyUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const text = params.get('text');
        if (text) setSpotifyUrl(text);
    }, []);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/spotify/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ spotifyUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                // Erfolgreich - zurück zur Übersicht
                router.push('/');
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
        <main className="min-h-screen bg-white">
            {/* Back Button */}
            <div className="p-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Song hinzufügen</h1>
                    <p className="text-gray-600">Füge deinen Song des Tages hinzu</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Field */}
                    <div>
                        <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            Spotify URL
                        </label>
                        <input
                            type="url"
                            id="spotifyUrl"
                            value={spotifyUrl}
                            onChange={(e) => setSpotifyUrl(e.target.value)}
                            placeholder="https://open.spotify.com/track/..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                        <p className="mt-2 text-sm text-gray-500">
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
                        disabled={isLoading || !spotifyUrl.trim()}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? 'Wird hinzugefügt...' : 'Song hinzufügen'}
                    </button>
                </form>

                {/* Help Section */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Wie finde ich die Spotify URL?</h3>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Öffne den Song in der Spotify App</li>
                        <li>Klicke auf "Teilen"</li>
                        <li>Klicke auf "Kopieren"</li>
                        <li>Füge die URL hier ein</li>
                    </ol>
                </div>
            </div>
        </main>
    );
}
