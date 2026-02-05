'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FriendRequest {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    status: number;
    createdAt: string;
}

interface Friend {
    _id: string;
    friend: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}


export default function FriendsPage() {
    const [friendName, setFriendName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        fetchFriendsData();
    }, []);

    const fetchFriendsData = async () => {
        try {
            // Pending requests (die ich bestätigen muss)
            const pendingRes = await fetch('/api/friends/pending');
            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                setPendingRequests(pendingData.requests);
            }

            // Aktuelle Freunde
            const friendsRes = await fetch('/api/friends/list');
            if (friendsRes.ok) {
                const friendsData = await friendsRes.json();
                setFriends(friendsData.friends);
            }
        } catch (error) {
            console.error('Error fetching friends data:', error);
        }
    };

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!friendName.trim()) {
            setMessage('Bitte gib einen Namen ein');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/friends/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendName: friendName.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Friend Request erfolgreich gesendet!');
                setFriendName('');
                // Daten neu laden um eventuelle Änderungen zu sehen
                fetchFriendsData();
            } else {
                setMessage(data.error || 'Fehler beim Senden der Request');
            }
        } catch (error) {
            setMessage('Netzwerkfehler');
        } finally {
            setLoading(false);
        }
    };

    const handleRespondToRequest = async (requestId: string, action: 'accept' | 'deny') => {
        try {
            const response = await fetch('/api/friends/respond', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId, action }),
            });

            if (response.ok) {
                // Request aus der Liste entfernen
                setPendingRequests(prev => prev.filter(req => req._id !== requestId));
                setMessage(`Friend Request ${action === 'accept' ? 'akzeptiert' : 'abgelehnt'}`);
            } else {
                const data = await response.json();
                setMessage(data.error || 'Fehler bei der Antwort');
            }
        } catch (error) {
            setMessage('Netzwerkfehler');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ backgroundColor: 'var(--ios-bg-primary)' }}>
            {/* Header */}
            <div className="ios-header">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center">
                        <Link href="/settings" className="mr-3">
                            <svg className="w-6 h-6" style={{ color: 'var(--ios-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-semibold" style={{ color: 'var(--ios-text-primary)' }}>Freunde</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Friend Request Form */}
                <div className="ios-section mb-6">
                    <h2 className="ios-section-title">Freund hinzufügen</h2>
                    <div className="ios-card">
                        <form onSubmit={handleSendRequest} className="flex gap-3">
                            <input
                                type="text"
                                value={friendName}
                                onChange={(e) => setFriendName(e.target.value)}
                                placeholder="Name des Freundes eingeben..."
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ 
                                    backgroundColor: 'var(--ios-bg-secondary)',
                                    borderColor: 'var(--ios-border)',
                                    color: 'var(--ios-text-primary)'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                            >
                                {loading ? 'Senden...' : 'Senden'}
                            </button>
                        </form>
                        {message && (
                            <div className={`mt-3 p-3 rounded-lg text-sm ${
                                message.includes('erfolgreich') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="ios-section mb-6">
                        <h2 className="ios-section-title">Anfragen ({pendingRequests.length})</h2>
                        <div className="ios-feed">
                            {pendingRequests.map((request) => (
                                <div key={request._id} className="ios-card">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                <span className="text-blue-600">👤</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold" style={{ color: 'var(--ios-text-primary)' }}>
                                                    {request.user.name}
                                                </h3>
                                                <p className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                                                    {request.user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRespondToRequest(request._id, 'deny')}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                            >
                                                Ablehnen
                                            </button>
                                            <button
                                                onClick={() => handleRespondToRequest(request._id, 'accept')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Akzeptieren
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Aktuelle Freunde */}
                <div className="ios-section">
                    <h2 className="ios-section-title">Aktuelle Freunde ({friends.length})</h2>
                    {friends.length > 0 ? (
                        <div className="ios-feed">
                            {friends.map((friend) => (
                                <div key={friend._id} className="ios-card">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <span className="text-green-600">👤</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold" style={{ color: 'var(--ios-text-primary)' }}>
                                                    {friend.friend.name}
                                                </h3>
                                                <p className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                                                    {friend.friend.email}
                                                </p>
                                                <p className="text-xs" style={{ color: 'var(--ios-text-tertiary)' }}>
                                                    Seit {new Date(friend.createdAt).toLocaleDateString('de-DE')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ios-card">
                            <div className="text-center py-8" style={{ color: 'var(--ios-text-secondary)' }}>
                                <span className="text-4xl mb-3 block">👥</span>
                                <p>Noch keine Freunde</p>
                                <p className="text-sm mt-1">Füge Freunde hinzu um ihre Songs zu sehen</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
