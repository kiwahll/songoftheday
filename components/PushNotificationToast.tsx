'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PushNotificationToast() {
    const [hasRegistration, setHasRegistration] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkPushRegistration();
    }, []);

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

    if (isLoading || hasRegistration) return null;

    return (
        <div className="mx-4 mt-2">
            <div className="ios-card px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                        <span className="text-amber-600 mr-2 text-sm">🔔</span>
                        <p className="text-xs" style={{ color: 'var(--ios-text-primary)' }}>
                            Push-Benachrichtigungen nicht aktiviert
                        </p>
                    </div>
                    <Link 
                        href="/settings/notifications"
                        className="text-xs text-amber-600 hover:text-amber-800 underline ml-3"
                    >
                        Aktivieren
                    </Link>
                </div>
            </div>
        </div>
    );
}
