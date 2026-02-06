"use client";

import { useState } from 'react';
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL
});

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            });
        } catch (error) {
            console.error('Google Login Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: 'var(--ios-text-primary)' }}>Song of the Day</h2>
                        <p className="text-gray-600" style={{ color: 'var(--ios-text-secondary)' }}>Melde dich mit deinem Google-Konto an</p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="ios-button-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Wird verbunden...' : 'Mit Google fortfahren'}
                    </button>
                </div>
            </main>
        </div>
    );
}
