import { NextRequest, NextResponse } from 'next/server';
import Entry from '@/lib/models/Entry';
import dbConnect from '@/lib/mongodb';
import { fetchSpotifyTrack } from '@/lib/spotify';
import { cookies } from 'next/headers';

// Hilfsfunktion: Spotify Track ID aus URL extrahieren
function extractSpotifyId(url: string): string | null {
    const match = url.match(/spotify\.com\/(?:intl-[^\/]+\/)?track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

// Hilfsfunktion: Prüfen ob heute bereits ein Entry existiert
async function checkTodayEntry(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await Entry.findOne({
        user: userId,
        createdAt: { $gte: today, $lt: tomorrow }
    });
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const code = cookieStore.get("code");
        const { spotifyUrl } = await request.json();

        console.log(code);
        if (!code) {
            return NextResponse.json(
                { error: "Kein Login Vorhanden" },
                { status: 401 }
            );
        }

        if (!spotifyUrl) {
            return NextResponse.json(
                { error: "Spotify URL ist erforderlich" },
                { status: 400 }
            );
        }

        // 1. Tageslimit prüfen
        const todayEntry = await checkTodayEntry(code.value);
        if (todayEntry) {
            return NextResponse.json(
                { error: "Heute bereits ein Song hinzugefügt" },
                { status: 429 }
            );
        }

        // 2. Track ID extrahieren
        const trackId = extractSpotifyId(spotifyUrl);
        if (!trackId) {
            return NextResponse.json(
                { error: "Ungültige Spotify URL" },
                { status: 400 }
            );
        }

        // 3. Spotify API aufrufen
        const trackData = await fetchSpotifyTrack(trackId);

        // 4. Entry erstellen
        const entry = await Entry.create({
            name: trackData.name,
            artist: trackData.artists[0]?.name || 'Unknown Artist',
            spotifyId: trackData.id,
            imageSrc: trackData.album.images[0]?.url || null,
            user: code.value
        });

        return NextResponse.json(entry, { status: 201 });

    } catch (error) {
        console.error('Spotify Import Error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}
