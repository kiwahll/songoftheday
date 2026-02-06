import FriendRequest from "@/lib/models/FriendRequest";
import Friend from "@/lib/models/Friend";
import { FriendRequestStatus } from "@/lib/models/FriendRequest";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        const session = await auth.api.getSession({
            headers: await headers()
        });
        const userCode = session?.user.id;

        if (!userCode) {
            return NextResponse.json(
                { error: "Kein Login vorhanden" },
                { status: 401 }
            );
        }

        // Request ID und Action aus Body holen
        const { requestId, action } = await request.json();

        if (!requestId) {
            return NextResponse.json(
                { error: "Request ID ist erforderlich" },
                { status: 400 }
            );
        }

        if (!action || !['accept', 'deny'].includes(action)) {
            return NextResponse.json(
                { error: "Action muss 'accept' oder 'deny' sein" },
                { status: 400 }
            );
        }

        // Friend Request finden und validieren
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return NextResponse.json(
                { error: "Friend Request nicht gefunden" },
                { status: 404 }
            );
        }

        // Prüfen ob dieser User der potentialFriend ist
        if (friendRequest.potentialFriendId.toString() !== userCode) {
            return NextResponse.json(
                { error: "Nicht berechtigt auf diese Request zu antworten" },
                { status: 403 }
            );
        }

        // Prüfen ob Status noch pending ist
        if (friendRequest.status !== FriendRequestStatus.pending) {
            return NextResponse.json(
                { error: "Request wurde bereits bearbeitet" },
                { status: 409 }
            );
        }

        if (action === 'accept') {
            // Friendship erstellen
            const friendship = new Friend({
                users: [friendRequest.user, friendRequest.potentialFriendId]
            });

            await friendship.save();

            // Request Status auf approved setzen
            friendRequest.status = FriendRequestStatus.approved;
            await friendRequest.save();

            return NextResponse.json(
                {
                    message: "Friend Request akzeptiert",
                    friendshipId: friendship._id
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

        } else if (action === 'deny') {
            // Request Status auf denied setzen
            friendRequest.status = FriendRequestStatus.denied;
            await friendRequest.save();

            return NextResponse.json(
                { message: "Friend Request abgelehnt" },
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
        }

    } catch (error) {
        console.error('Friend Response Error:', error);

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
