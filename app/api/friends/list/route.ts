import Friend from "@/lib/models/Friend";
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

        // Alle Friendships finden wo der User beteiligt ist
        const friendships = await Friend.find({
            users: userCode
        });

        const db = getDb();
        const friendShipsWithUserData = await Promise.all(friendships.map(async (friendship) => {
            const friendId = friendship.users.find((id: any) => id.toString() !== userCode.toString());
            const friendUser = await db.collection('user').findOne(
                { _id: new ObjectId(friendId) }
            );
            return {
                _id: friendship._id,
                friend: friendUser,
                createdAt: friendship.createdAt
            };
        }));
        
        return NextResponse.json(
            {
                friends: friendShipsWithUserData,
                count: friendShipsWithUserData.length
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
        console.error('Friends List Error:', error);

        return NextResponse.json(
            { error: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}
