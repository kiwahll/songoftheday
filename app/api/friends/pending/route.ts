import User from "@/lib/models/User";
import FriendRequest from "@/lib/models/FriendRequest";
import { FriendRequestStatus } from "@/lib/models/FriendRequest";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        // User ID aus Cookie holen
        const cookieStore = await cookies();
        const userCode = cookieStore.get("code")?.value;
        
        if (!userCode) {
            return NextResponse.json(
                { error: "Kein Login vorhanden" },
                { status: 401 }
            );
        }
        
        // User validieren
        const user = await User.findById(userCode);
        if (!user) {
            return NextResponse.json(
                { error: "Ungültiger User" },
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
