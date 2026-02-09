import SongEntrySlot from "@/lib/components/SongEntrySlot";
import Link from 'next/link';
import { auth } from "@/lib/auth";
import PushNotificationToast from "@/components/PushNotificationToast";
import { headers } from "next/headers";

async function loadUserFriends(currentUser: any) {
    if (!currentUser) return [];

    try {
        const requestHeaders = await headers();
        const response = await fetch(`${process.env.BETTER_AUTH_BASE_URL || 'http://localhost:3000'}/api/friends/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': requestHeaders.get('cookie') || '',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('Failed to fetch friends:', response.status);
            return [];
        }

        const data = await response.json();
        return data.friends?.map((friendship: any) => friendship.friend) || [];
    } catch (error) {
        console.error('Error fetching friends:', error);
        return [];
    }
}

export default async function Home() {
    let currentUser: any = undefined;

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (session?.user) {
            currentUser = session.user;
        }
    } catch (error) {
        console.error('Error fetching session:', error);
    }

    const friends = await loadUserFriends(currentUser);

    const today = new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            {/* iOS Header */}
            <header className="ios-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="ios-title">Song of the Day</h1>
                        <p className="ios-subtitle">{today}</p>
                    </div>
                    <div className="ios-header-icon">
                        <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors" style={{ color: 'var(--ios-text-secondary)' }}>
                            ⚙️
                        </Link>
                    </div>
                </div>
            </header>

            <PushNotificationToast />

            {/* Feed Container */}
            <main className="ios-feed-container">
                {/* Dein Song Card */}
                <div className="ios-section">
                    <SongEntrySlot />
                </div>

                {/* Freunde Songs */}
                <div className="ios-section">
                    <h2 className="ios-section-title">Freunde</h2>
                    <div className="ios-feed">
                        {friends.map((user: any) => (
                            <SongEntrySlot key={user._id} user={user} />
                        ))}
                    </div>
                </div>

                {/* Fester Song hinzufügen Button */}
                <div className="ios-action-button">
                    <Link
                        href="/add-song"
                        className="ios-button-primary"
                    >
                        <span className="text-xl mr-2">+</span>
                        Song hinzufügen
                    </Link>
                </div>
            </main>
        </div>
    );
}
