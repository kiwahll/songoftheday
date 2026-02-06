import { cookies } from "next/headers";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import Link from 'next/link';

export default async function SettingsPage() {
    await dbConnect();
    const cookieStore = await cookies();
    const code = cookieStore.get("code")?.value;

    // Aktuellen User holen für Profil-Daten
    const currentUser = code ? await User.findById(code).lean() : null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            {/* iOS Header */}
            <header className="ios-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="ios-back-button mr-4"
                        >
                            ←
                        </Link>
                        <div>
                            <h1 className="ios-title">Einstellungen</h1>
                            <p className="ios-subtitle">Profil und App-Einstellungen</p>
                        </div>
                    </div>
                    <div className="ios-header-icon">
                        ⚙️
                    </div>
                </div>
            </header>

            {/* Settings Container */}
            <main className="ios-feed-container">
                {/* Profil Card */}
                <div className="ios-section">
                    <div className="ios-card ios-settings-profile">
                        <div className="flex flex-col items-center">
                            {/* Großes Profilbild */}
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
                                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            {/* Username */}
                            <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ color: 'var(--ios-text-primary)' }}>
                                {currentUser?.name || "Unbekannter User"}
                            </h2>

                            {/* Status */}
                            <p className="text-sm text-gray-500" style={{ color: 'var(--ios-text-secondary)' }}>
                                {currentUser ? "Mein Profil" : "Nicht angemeldet"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Einstellungs-Liste */}
                <div className="ios-section">
                    <h2 className="ios-section-title">Account</h2>
                    <div className="ios-feed">
                        {/* Profil bearbeiten */}
                        <Link href="/" className="ios-card ios-settings-item">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <span className="text-blue-600">👤</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900" style={{ color: 'var(--ios-text-primary)' }}>Profil bearbeiten</h3>
                                        <p className="text-sm text-gray-500" style={{ color: 'var(--ios-text-secondary)' }}>Namen und Avatar ändern</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Freunde */}
                        <Link href="/settings/friends" className="ios-card ios-settings-item">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                        <span className="text-orange-600">👥</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900" style={{ color: 'var(--ios-text-primary)' }}>Freunde</h3>
                                        <p className="text-sm text-gray-500" style={{ color: 'var(--ios-text-secondary)' }}>Freunde hinzufügen / akzeptieren</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* App-Einstellungen */}
                <div className="ios-section">
                    <h2 className="ios-section-title">App</h2>
                    <div className="ios-feed">
                        {/* Benachrichtigungen */}
                        <Link href="/settings/notifications" className="ios-card ios-settings-item">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                        <span className="text-purple-600">🔔</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900" style={{ color: 'var(--ios-text-primary)' }}>Benachrichtigungen</h3>
                                        <p className="text-sm text-gray-500" style={{ color: 'var(--ios-text-secondary)' }}>Push-Einstellungen</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Datenschutz */}
                        <Link href="/" className="ios-card ios-settings-item">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                        <span className="text-gray-600">🔒</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900" style={{ color: 'var(--ios-text-primary)' }}>Datenschutz</h3>
                                        <p className="text-sm text-gray-500" style={{ color: 'var(--ios-text-secondary)' }}>Daten und Sicherheit</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {process.env.IOS_SHORTCUT_URL && (
                            <Link href={process.env.IOS_SHORTCUT_URL} target="_blank" className="ios-card ios-settings-item">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <span className="text-red-600">🔗</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-600">iOS Kurzbefehl</h3>
                                            <p className="text-sm text-gray-500">Teilen funktion hinzufügen</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Abmelden */}
                        <Link href="/" className="ios-card ios-settings-item">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                        <span className="text-red-600">🚪</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-red-600" style={{ color: '#ef4444' }}>Abmelden</h3>
                                        <p className="text-sm text-gray-500" style={{ color: 'var(--ios-text-secondary)' }}>Aus App ausloggen</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main >
        </div >
    );
}
