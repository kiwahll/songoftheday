import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import PushRegistration from '@/lib/models/PushRegistration';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        const body = await request.json();
        const subscription = JSON.stringify(body);

        if (!subscription || typeof subscription !== 'string') {
            return NextResponse.json(
                { error: 'Token is required and must be a string' },
                { status: 400 }
            );
        }

        // Get current user from cookies
        const cookieStore = await cookies();
        const code = cookieStore.get("code")?.value;

        if (!code) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        // Check if user exists
        const user = await User.findById(code);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if token already exists for this user
        const existingRegistration = await PushRegistration.findOne({
            user: user._id
        });

        if (existingRegistration) {
            return NextResponse.json(
                { message: 'User has already a token!' },
                { status: 200 }
            );
        }

        // Create new push registration
        const pushRegistration = await PushRegistration.create({
            user: user._id,
            subscription: subscription
        });

        return NextResponse.json(
            {
                message: 'Push registration successful',
                registrationId: pushRegistration._id
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Push registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get current user from cookies
        const cookieStore = await cookies();
        const code = cookieStore.get("code")?.value;

        if (!code) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        // Check if user exists
        const user = await User.findById(code);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has push registration
        const existingRegistration = await PushRegistration.findOne({
            user: user._id
        });

        return NextResponse.json(
            { 
                hasRegistration: !!existingRegistration,
                registrationId: existingRegistration?._id
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Push registration check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        // Get current user from cookies
        const cookieStore = await cookies();
        const code = cookieStore.get("code")?.value;

        if (!code) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        // Check if user exists
        const user = await User.findById(code);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Delete all push registrations for this user
        const result = await PushRegistration.deleteMany({
            user: user._id
        });

        return NextResponse.json(
            { 
                message: 'All push registrations deleted successfully',
                deletedCount: result.deletedCount
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Push registration deletion error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
