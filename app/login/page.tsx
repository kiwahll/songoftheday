"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleSubmit(formData: FormData) {
        const code = formData.get('code') as string;

        if (!code) {
            setError('Bitte gib einen Einladungscode ein');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Authentifizierung fehlgeschlagen');
                return;
            }

            // Erfolgreiche Authentifizierung - Cookie wird server-seitig gesetzt
            console.log('Auth erfolgreich:', data.message);
            
            // Redirect zur Startseite
            window.location.href = '/';

        } catch (err) {
            setError('Netzwerkfehler. Bitte versuche es später erneut.');
            console.error('Network error:', err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* iOS Header */}
            <header className="ios-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="ios-title">Song of the Day</h1>
                    </div>
                    <div className="ios-header-icon">
                        🎵
                    </div>
                </div>
            </header>

            {/* Login Content */}
            <main className="ios-feed-container">
                <div className="ios-section">
                    {/* Logo/Icon */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto bg-blue-100 rounded-3xl flex items-center justify-center mb-4">
                            <span className="text-3xl">🎵</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Song of the Day</h2>
                        <p className="text-gray-600">Gib deinen Einladungscode ein um beizutreten</p>
                    </div>

                    {/* Invite Code Form */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div className="ios-form-group">
                            <label className="ios-label">Einladungscode</label>
                            <input
                                name='code'
                                type="text"
                                className="ios-input text-center text-lg tracking-widest font-mono"
                                placeholder="XXXX-XXXX"
                                maxLength={24}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="ios-button-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Wird überprüft...' : 'Beitreten'}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Du hast keinen Code?{' '}
                            <Link href="/signup" className="text-blue-500 font-semibold hover:text-blue-600">
                                Fordere eine Einladung an
                            </Link>
                        </p>
                    </div>

                    {/* Divider
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">oder</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div> */}

                    {/* Social Login
                    <div className="space-y-3">
                        <button className="ios-button-secondary">
                            <span className="mr-2">🍎</span>
                            Mit Apple fortfahren
                        </button>
                        <button className="ios-button-secondary">
                            <span className="mr-2">🎵</span>
                            Mit Spotify fortfahren
                        </button>
                    </div> */}
                </div>
            </main>
        </div>
    );
}
