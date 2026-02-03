import mongoose from "mongoose";
import Entry from "../models/Entry";
import { UserData } from "../models/User";
import dbConnect from "../mongodb";
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from "next/headers";

interface SongEntrySlotProps {
    user?: UserData | undefined
}

export default async function SongEntrySlot({ user = undefined }: SongEntrySlotProps) {
    await dbConnect();
    const cookieStore = await cookies();
    const code = cookieStore.get("code")?.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entrie = user
        ? await Entry.findOne({
            user: new mongoose.Types.ObjectId(user._id), createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        }).lean()
        : await Entry.findOne({
            user: new mongoose.Types.ObjectId(code), createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        }).lean();

    if (user) {
        return (
            <div className="ios-card">
                {/* User Header - kleiner und dezenter */}
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold text-xs mr-2">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="username-accent">{user.name}</p>
                        <p className="text-xs text-gray-400">heute</p>
                    </div>
                </div>

                {/* Album Cover - größer und prominenter */}
                <div className="relative mb-3">
                    <div className="w-40 h-40 mx-auto bg-gray-100 rounded-3xl shadow-lg overflow-hidden ring-4 ring-white ring-offset-2 ring-offset-gray-50">
                        {entrie ? (
                            <Image 
                                src={entrie.imageSrc || "https://i.scdn.co/image/ab67616d00001e02b5c53fb3985d4f1aa48bfe77"} 
                                width={160} 
                                height={160} 
                                alt="Album Cover" 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
                                <div className="text-gray-400 text-center">
                                    <div className="text-3xl mb-2">🎵</div>
                                    <p className="text-xs">Noch kein Song</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Song Infos - prominenter */}
                <div className="text-center">
                    <h3 className="song-title-bold mb-1 truncate">
                        {entrie ? entrie.name : "Kein Song gewählt"}
                    </h3>
                    <p className="text-gray-700 text-sm truncate font-medium">
                        {entrie ? entrie.artist : "Warte auf Song..."}
                    </p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="ios-card ios-card--own">
                {/* User Header - kleiner und dezenter */}
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs mr-2">
                        DU
                    </div>
                    <div>
                        <p className="username-accent">Dein Song</p>
                        <p className="text-xs text-gray-400">heute</p>
                    </div>
                </div>

                {/* Album Cover - größer und prominenter */}
                <div className="relative mb-3">
                    <div className="w-40 h-40 mx-auto bg-gray-100 rounded-3xl shadow-lg overflow-hidden ring-4 ring-white ring-offset-2 ring-offset-blue-50">
                        {entrie ? (
                            <Image 
                                src={entrie.imageSrc} 
                                width={160} 
                                height={160} 
                                alt="Album Cover" 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <Link href="/add-song" className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 rounded-3xl">
                                <div className="text-center">
                                    <div className="text-4xl mb-2 text-blue-500">+</div>
                                    <p className="text-sm text-blue-600 font-medium">Song hinzufügen</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Song Infos - prominenter */}
                <div className="text-center">
                    <h3 className="song-title-bold mb-1 truncate">
                        {entrie ? entrie.name : "Song hinzufügen"}
                    </h3>
                    <p className="text-gray-700 text-sm truncate font-medium">
                        {entrie ? entrie.artist : "Auf das Plus klicken"}
                    </p>
                </div>
            </div>
        );
    }
}