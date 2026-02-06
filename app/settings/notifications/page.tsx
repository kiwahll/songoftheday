'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotificationsPage() {
    const [hasPushRegistration, setHasPushRegistration] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }

    useEffect(() => {
        checkPushRegistration();
    }, []);

    async function checkPushRegistration() {
        try {
            const response = await fetch('/api/pushregister', {
                method: 'GET',
            });
            
            if (response.ok) {
                const data = await response.json();
                setHasPushRegistration(data.hasRegistration);
            }
        } catch (error) {
            console.error('Fehler beim Prüfen der Push-Registration:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function unsubscribePush() {
        try {
            const response = await fetch('/api/pushregister', {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Push-Registration erfolgreich entfernt:', data);
                setHasPushRegistration(false);
            } else {
                const error = await response.json();
                console.error('Fehler beim Entfernen der Push-Registration:', error);
            }
        } catch (error) {
            console.error('Fehler beim Entfernen der Push-Registration:', error);
        }
    }

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
            setHasPushRegistration(true);
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
                            {!isLoading && (
                                <>
                                    {hasPushRegistration ? (
                                        <button
                                            onClick={() => unsubscribePush()}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Entfernen
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => subscribePush()}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                        >
                                            Aktivieren
                                        </button>
                                    )}
                                </>
                            )}
                            {isLoading && (
                                <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">
                                    Lade...
                                </div>
                            )}
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
