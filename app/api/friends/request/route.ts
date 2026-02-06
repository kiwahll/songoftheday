import FriendRequest from "@/lib/models/FriendRequest";
import Friend from "@/lib/models/Friend";
import { FriendRequestStatus } from "@/lib/models/FriendRequest";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { notifyFriendRequest } from "@/lib/notifications";
import { auth, getDb } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const session = await auth.api.getSession({
            headers: await headers()
        });
        const user = session?.user;

        //await getDb().collection("user").findOne({ _id: new ObjectId(senderId) });

        if (!user) {
            return NextResponse.json(
                { error: "Kein Login vorhanden" },
                { status: 401 }
            );
        }

        // 3. Friend Name aus Request Body
        const { friendName } = await request.json();
        if (!friendName) {
            return NextResponse.json(
                { error: "Friend Name ist erforderlich" },
                { status: 400 }
            );
        }

        // 4. Selbst-Add verhindern
        if (user.name === friendName) {
            return NextResponse.json(
                { error: "Kann nicht sich selbst als Freund hinzufügen" },
                { status: 400 }
            );
        }

        // 5. Friend anhand des Namens finden
        const friend = await getDb().collection("user").findOne({ name: friendName });
        if (!friend) {
            return NextResponse.json(
                { error: "Friend nicht gefunden" },
                { status: 404 }
            );
        }

        const friendId = friend._id.toString();

        // 6. Doppelte pending Request prüfen
        const existingRequest = await FriendRequest.findOne({
            user: user.id,
            potentialFriendId: friendId,
            status: FriendRequestStatus.pending
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: "Friend Request bereits gesendet" },
                { status: 409 }
            );
        }

        // 7. Bestehende Friendship prüfen
        const existingFriendship = await Friend.findOne({
            users: { $all: [user.id, friendId] }
        });

        if (existingFriendship) {
            return NextResponse.json(
                { error: "Bereits befreundet" },
                { status: 409 }
            );
        }

        // 8. Neue Friend Request erstellen
        const friendRequest = new FriendRequest({
            user: user.id,
            potentialFriendId: friendId,
            status: FriendRequestStatus.pending
        });

        await friendRequest.save();

        notifyFriendRequest(friendId, user.id);
        return NextResponse.json(
            {
                message: "Friend Request erfolgreich erstellt",
                requestId: friendRequest._id
            },
            {
                status: 201,
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
        console.error('Friend Request Error:', error);

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
