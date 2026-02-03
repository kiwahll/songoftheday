import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

        const cookieStore = await cookies();
        cookieStore.set("code", code, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 259200, // 3 Tage in Sekunden
            path: '/'
        });

        return NextResponse.json(
            { message: "Auth erfolgreich" }, 
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