import { NextRequest, NextResponse } from 'next/server';
import Entry from '@/lib/models/Entry';
import dbConnect from '@/lib/mongodb';
import { headers } from 'next/headers';
import { notifySong } from '@/lib/notifications';
import { auth } from "@/lib/auth";
import { createSoundCloudTrackData, createSpotifyTrackData } from '@/lib/createTrackData';

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
        const session = await auth.api.getSession({
            headers: await headers()
        });
        const code = session?.user.id;
        const { songUrl } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: "Kein Login Vorhanden" },
                { status: 401 }
            );
        }

        if (!songUrl) {
            return NextResponse.json(
                { error: "Song URL ist erforderlich" },
                { status: 400 }
            );
        }

        // 1. Tageslimit prüfen
        const todayEntry = await checkTodayEntry(code);
        if (todayEntry) {
            await Entry.findByIdAndDelete(todayEntry._id);
        }

        let trackData: any = null;
        if (songUrl.includes("spotify.com")) {
            trackData = await createSpotifyTrackData(songUrl);
        } else if (songUrl.includes("soundcloud.com")) {
            trackData = await createSoundCloudTrackData(songUrl);
        } else {
            return NextResponse.json(
                { error: "Ungültige Plattform" },
                { status: 400 }
            );
        }

        if (!trackData) {
            return NextResponse.json(
                { error: "Ungültige URL" },
                { status: 400 }
            );
        }

        console.log(trackData.songUrl);
        // 4. Entry erstellen
        const entry = await Entry.create({
            ...trackData,
            user: code
        });

        notifySong(code);
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
