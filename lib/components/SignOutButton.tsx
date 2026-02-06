"use client";

export default function SignOutButton() {
    const signOut = async () => {
        try {
            const response = await fetch('/api/auth/signout', { method: 'POST' });
            
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Sign out failed');
            }
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    return (
        <div onClick={signOut} className="ios-card ios-settings-item">
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
        </div>
    );
}