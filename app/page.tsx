import SongEntrySlot from "@/lib/components/SongEntrySlot";
import Link from 'next/link';
import Friend from "@/lib/models/Friend";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import PushNotificationToast from "@/components/PushNotificationToast";
import { headers } from "next/headers";

export default async function Home() {
    let friends = [];
    let currentUser: any = undefined;

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (session?.user) {
            currentUser = session.user;
            await dbConnect();

            const friendships = await Friend.find({
                users: currentUser.id
            }).populate('users', 'name email');

            friends = friendships.map(friendship => {
                const friendUser = friendship.users.find((u: any) => u._id.toString() !== currentUser.id);
                return friendUser;
            }).filter(item => item);
        }
    } catch (error) {
        console.error('Error fetching friends data:', error);
    }

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
