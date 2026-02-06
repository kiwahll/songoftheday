import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Session beenden
        await auth.api.signOut({
            headers: request.headers
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Sign out error:', error);
        return NextResponse.json(
            { error: 'Sign out failed' },
            { status: 500 }
        );
    }
}
