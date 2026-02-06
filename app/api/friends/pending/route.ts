import FriendRequest from "@/lib/models/FriendRequest";
import { FriendRequestStatus } from "@/lib/models/FriendRequest";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

        // Alle pending Requests für diesen User holen (wo er der potentialFriend ist)
        const pendingRequests = await FriendRequest.find({
            potentialFriendId: userCode,
            status: FriendRequestStatus.pending
        }).populate('user', 'name email'); // Sender details populated

        return NextResponse.json(
            {
                requests: pendingRequests,
                count: pendingRequests.length
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
        console.error('Pending Requests Error:', error);

        return NextResponse.json(
            { error: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}
