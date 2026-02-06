import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Entry from '@/lib/models/Entry';
import PushRegistration from '@/lib/models/PushRegistration';
import webPush from "web-push";

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function GET() {
    try {
        await dbConnect();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const allUsers = await User.find({});

        const usersWithoutTodayEntry = [];

        for (const user of allUsers) {
            const todayEntry = await Entry.findOne({
                user: user._id,
                createdAt: {
                    $gte: today,
                    $lt: tomorrow
                }
            });

            if (!todayEntry) {
                usersWithoutTodayEntry.push({
                    id: user._id,
                    name: user.name,
                    email: user.email
                });
            }
        }

        const usersWithoutTodayEntryIds = usersWithoutTodayEntry.map(user => user.id);
        const subscriptions = await PushRegistration.find(
            {
                user: { $in: usersWithoutTodayEntryIds },
                subscription: { $ne: null },
            },
            { subscription: 1, _id: 0 }
        ).lean();

        const pushSubscriptions = subscriptions.map(s => JSON.parse(s.subscription));
        const notificationSent = new Set();
        const payload = JSON.stringify({
            title: "⏰ Reminder",
            body: "You haven't created an entry today",
        });

        for (const subscription of pushSubscriptions) {
            const endpointKey = subscription.endpoint;
            
            if (!notificationSent.has(endpointKey)) {
                try {
                    await webPush.sendNotification(subscription, payload);
                    notificationSent.add(endpointKey);
                } catch (error) {
                    console.error(`Failed to send notification to ${endpointKey}:`, error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                date: today.toISOString().split('T')[0],
                totalUsers: allUsers.length,
                usersWithoutEntry: usersWithoutTodayEntry.length
            }
        });

    } catch (error) {
        console.error('Error in notify API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
