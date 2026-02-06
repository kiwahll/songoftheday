import dbConnect from '@/lib/mongodb';
import PushRegistration from '@/lib/models/PushRegistration';
import User from '@/lib/models/User';
import Friend from '@/lib/models/Friend';
import webPush from "web-push";

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function notifyFriendRequest(friendId: string, senderId: string) {
    try {
        await dbConnect();
        
        // Get sender name from database
        const sender = await User.findById(senderId);
        const senderName = sender?.name || "Jemand";
        
        const message = {
            title: "👋 Neue Freundesanfrage",
            body: `Du hast eine neue Freundesanfrage von ${senderName} erhalten`
        };

        const subscription = await PushRegistration.findOne(
            {
                user: friendId,
                subscription: { $ne: null },
            },
            { subscription: 1, _id: 0 }
        ).lean();

        if (!subscription) {
            console.log(`No push registration found for user ${friendId}`);
            return;
        }

        const pushSubscription = JSON.parse(subscription.subscription);
        const payload = JSON.stringify(message);

        try {
            await webPush.sendNotification(pushSubscription, payload);
            console.log(`Friend request notification sent to ${friendId}`);
        } catch (error) {
            console.error(`Failed to send friend request notification:`, error);
        }
    } catch (error) {
        console.error('Error in notifyFriendRequest:', error);
    }
}

export async function notifySong(currentUserId: string) {
    try {
        await dbConnect();
        
        // Get current user name
        const currentUser = await User.findById(currentUserId);
        const userName = currentUser?.name || "Jemand";
        
        // Find all friends of the current user
        const friendships = await Friend.find({
            users: currentUserId
        }).lean();
        
        // Extract friend IDs (all users in friendships except current user)
        const friendIds = friendships
            .flatMap(friendship => friendship.users)
            .filter(userId => userId.toString() !== currentUserId);
        
        if (friendIds.length === 0) {
            console.log(`No friends found for user ${currentUserId}`);
            return;
        }
        
        const message = {
            title: "🎵 Neuer Song von deinem Freund",
            body: `${userName} hat einen neuen Song eingestellt`
        };
        
        // Send notification to each friend
        for (const friendId of friendIds) {
            const subscription = await PushRegistration.findOne(
                {
                    user: friendId,
                    subscription: { $ne: null },
                },
                { subscription: 1, _id: 0 }
            ).lean();

            if (!subscription) {
                console.log(`No push registration found for user ${friendId}`);
                continue;
            }

            const pushSubscription = JSON.parse(subscription.subscription);
            const payload = JSON.stringify(message);

            try {
                await webPush.sendNotification(pushSubscription, payload);
                console.log(`Song notification sent to ${friendId}`);
            } catch (error) {
                console.error(`Failed to send song notification to ${friendId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in notifySong:', error);
    }
}