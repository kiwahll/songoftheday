import SongEntrySlot from "@/lib/components/SongEntrySlot";
import Link from 'next/link';
import User from "@/lib/models/User";
import Friend from "@/lib/models/Friend";
import dbConnect from "@/lib/mongodb";
import { cookies } from "next/headers";

export default async function Home() {
    let friends = [];
    try {
        // Direkte Datenbank-Abfrage
        await dbConnect();
        
        const cookieStore = await cookies();
        const userCode = cookieStore.get("code")?.value;
        
        if (userCode) {
            // User validieren
            const user = await User.findById(userCode);
            if (user) {
                // Alle Friendships finden wo der User beteiligt ist
                const friendships = await Friend.find({
                    users: userCode
                }).populate('users', 'name email');
                
                // Friends extrahieren (nicht der aktuelle User)
                friends = friendships.map(friendship => {
                    const friendUser = friendship.users.find((u: any) => u._id.toString() !== userCode);
                    return friendUser;
                }).filter(item => item); // Nur gültige Friends
            }
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
