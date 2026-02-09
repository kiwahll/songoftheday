import FriendRequest from "@/lib/models/FriendRequest";
import { FriendRequestStatus } from "@/lib/models/FriendRequest";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth, getDb } from "@/lib/auth";
import { ObjectId } from "mongodb";

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
        const db = getDb();
        const pendingRequests = await db.collection('friendrequests').find({
            potentialFriendId: new ObjectId(userCode),
            status: FriendRequestStatus.pending
        }).toArray();

        // User-Daten für jeden Request manuell nachladen
        const requestsWithUserData = await Promise.all(
            pendingRequests.map(async (request) => {
                try {
                    const user = await db.collection('user').findOne(
                        { _id: new ObjectId(request.user.toString()) }
                    );

                    return {
                        ...request,
                        user: user ? {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        } : null
                    };
                } catch (error) {
                    return {
                        ...request,
                        user: null
                    };
                }
            })
        );
        
        return NextResponse.json(
            {
                requests: requestsWithUserData,
                count: requestsWithUserData.length
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
