import { NextRequest, NextResponse } from 'next/server';
import Entry from '@/lib/models/Entry';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { cookies } from 'next/headers';

export async function POST(
    request: NextRequest
) {
    try {
        await dbConnect();

        // 1. User ID aus Cookie holen
        const cookieStore = await cookies();
        const userCode = cookieStore.get("code")?.value;

        if (!userCode) {
            return NextResponse.json(
                { error: "Kein Login vorhanden" },
                { status: 401 }
            );
        }

        // 2. User validieren
        const user = await User.findById(userCode);
        if (!user) {
            return NextResponse.json(
                { error: "Ungültiger User" },
                { status: 401 }
            );
        }

        // 3. Daten aus Request Body holen
        const { emoji, entryId } = await request.json();
        if (!emoji || typeof emoji !== 'string' || emoji.trim() === '') {
            return NextResponse.json(
                { error: "Emoji ist erforderlich" },
                { status: 400 }
            );
        }

        if (!entryId || typeof entryId !== 'string' || entryId.trim() === '') {
            return NextResponse.json(
                { error: "Entry ID ist erforderlich" },
                { status: 400 }
            );
        }

        // 4. Entry finden
        const entry = await Entry.findById(entryId);
        if (!entry) {
            return NextResponse.json(
                { error: "Entry nicht gefunden" },
                { status: 404 }
            );
        }

        // 5. Prüfen ob User bereits auf dieses Emoji reagiert hat
        const existingReaction = entry.reactions.find((r: any) => r.emoji === emoji);

        if (existingReaction) {
            // User zur existierenden Reaction hinzufügen, falls noch nicht vorhanden
            if (!existingReaction.users.includes(userCode)) {
                existingReaction.users.push(userCode);
            } else {
                return NextResponse.json(
                    { error: "User hat bereits auf dieses Emoji reagiert" },
                    { status: 409 }
                );
            }
        } else {
            // Neue Reaction erstellen
            entry.reactions.push({
                emoji: emoji.trim(),
                users: [userCode]
            });
        }

        // 6. Entry speichern
        await entry.save();

        return NextResponse.json(
            {
                message: "Reaction erfolgreich hinzugefügt",
                reactions: entry.reactions
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Vary': '*',
                    'Surrogate-Control': 'no-store'
                }
            }
        );

    } catch (error) {
        console.error('Add Reaction Error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Ungültige Anfrage" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}
