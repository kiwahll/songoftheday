import Friend from "@/lib/models/Friend";
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

        // Alle Friendships finden wo der User beteiligt ist
        const friendships = await Friend.find({
            users: userCode
        }).populate('users', 'name email'); // Alle User Details populated

        // Friends extrahieren (nicht der aktuelle User)
        const friends = friendships.map(friendship => {
            const friendUser = friendship.users.find((u: any) => u._id.toString() !== userCode);
            return {
                _id: friendship._id,
                friend: friendUser,
                createdAt: friendship.createdAt
            };
        }).filter(item => item.friend); // Nur gültige Friends

        return NextResponse.json(
            {
                friends: friends,
                count: friends.length
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
