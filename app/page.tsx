import SongEntrySlot from "@/lib/components/SongEntrySlot";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import Link from 'next/link';
import { cookies } from "next/headers";

export default async function Home() {
    await dbConnect();
    const cookieStore = await cookies();
    const code = cookieStore.get("code")?.value;
    const users = await User.find({ _id: { $ne: code } }).lean();

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
                        {users.map((user) => (
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
