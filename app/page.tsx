import SongEntrySlot from "@/lib/components/SongEntrySlot";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { currentUserId } from "@/lib/utils";

export default async function Home() {
    await dbConnect();
    const users = await User.find({ _id: { $ne: currentUserId } }).lean();

    return (
        <main className="h-screen flex flex-col bg-white">
            {/* Obere Hälfte */}
            <SongEntrySlot user={users[0]} />
            
            {/* Untere Hälfte */}
            <SongEntrySlot />
        </main>
    );
}
