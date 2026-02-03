import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { code } = await request.json();

        const user = await User.findById(code);
        if (!user) {
            return NextResponse.json(
                { error: "Ungültige Spotify URL" },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "Auth erfolgreich" }, { status: 201 });

    } catch (error) {
        console.error('Auth Error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Nicht gültiger Code" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}