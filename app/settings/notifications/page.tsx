'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getToken } from 'firebase/messaging';

export default function NotificationsPage() {
    const [settings, setSettings] = useState({
        newSongs: true,
        friendRequests: true,
        songReactions: true,
        dailyReminder: false,
    });

    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }

    const handleToggleSetting = (setting: string) => {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
    };

    async function subscribePush() {
        const registration = await navigator.serviceWorker.register("/sw.js");

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });

        // Token an Backend senden
        const response = await fetch('/api/pushregister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Token erfolgreich registriert:', data);
        } else {
            const error = await response.json();
            console.error('Fehler bei Token-Registrierung:', error);
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            {/* Header */}
            <header className="ios-header">
                <div className="flex items-center">
                    <Link href="/settings" className="ios-back-button mr-4">
                        ←
                    </Link>
                    <div>
                        <h1 className="ios-title">Benachrichtigungen</h1>
                        <p className="ios-subtitle">Push-Einstellungen verwalten</p>
                    </div>
                </div>
            </header>

            {/* Settings Container */}
            <main className="ios-feed-container">
                {/* Push-Berechtigung */}
                <div className="ios-section">
                    <h2 className="ios-section-title">Push-Benachrichtigungen</h2>
                    <div className="ios-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                    <span className="text-purple-600 text-lg">🔔</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base" style={{ color: 'var(--ios-text-primary)' }}>
                                        Push-Benachrichtigungen
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                                        Erlaube Benachrichtigungen in deinem Browser
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => subscribePush()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                                Aktivieren
                            </button>
                        </div>
                    </div>
                </div>

                {/* Benachrichtigungs-Einstellungen */}
                <div className="ios-section">
                    <h2 className="ios-section-title">Benachrichtigungsarten</h2>
                    <div className="ios-feed">
                        {/* Neue Songs */}
                        <div className="ios-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <span className="text-blue-600 text-lg">🎵</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base" style={{ color: 'var(--ios-text-primary)' }}>
                                            Neue Songs
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                                            Wenn Freunde neue Songs teilen
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('newSongs')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.newSongs ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.newSongs ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Freundschaftsanfragen */}
                        <div className="ios-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                                        <span className="text-orange-600 text-lg">👥</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base" style={{ color: 'var(--ios-text-primary)' }}>
                                            Freundschaftsanfragen
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                                            Neue Freundesanfragen und Bestätigungen
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('friendRequests')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.friendRequests ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.friendRequests ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Tägliche Erinnerung */}
                        <div className="ios-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                        <span className="text-purple-600 text-lg">⏰</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base" style={{ color: 'var(--ios-text-primary)' }}>
                                            Tägliche Erinnerung
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                                            Erinnerung an den heutigen Song
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('dailyReminder')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.dailyReminder ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.dailyReminder ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info-Box */}
                <div className="ios-section">
                    <div className="ios-card">
                        <div className="text-center py-4" style={{ color: 'var(--ios-text-secondary)' }}>
                            <span className="text-3xl mb-2 block">ℹ️</span>
                            <p className="text-sm">Push-Benachrichtigungen funktionieren nur, wenn du diese in deinem Browser erlaubst.</p>
                            <p className="text-sm mt-1">Du kannst sie jederzeit in den Browser-Einstellungen deaktivieren.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
