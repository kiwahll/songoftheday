import mongoose from "mongoose";
import Entry from "../models/Entry";
import { UserData } from "../models/User";
import dbConnect from "../mongodb";
import { currentUserId } from "../utils";
import Image from 'next/image';
import { Suspense } from "react";
import Link from 'next/link';

interface SongEntrySlotProps {
    user?: UserData | undefined
}

export default async function SongEntrySlot({ user = undefined }: SongEntrySlotProps) {
    await dbConnect();

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
            user: new mongoose.Types.ObjectId(currentUserId), createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        }).lean();

    if (user) {
        return (
            <div className="ios-card">
                {/* User Header */}
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">heute</p>
                    </div>
                </div>

                {/* Album Cover */}
                <div className="relative mb-4">
                    <div className="w-28 h-28 mx-auto bg-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        {entrie ? (
                            <Image 
                                src={entrie.imageSrc || "https://i.scdn.co/image/ab67616d00001e02b5c53fb3985d4f1aa48bfe77"} 
                                width={112} 
                                height={112} 
                                alt="Album Cover" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <div className="text-gray-400 text-center">
                                    <div className="text-2xl mb-1">🎵</div>
                                    <p className="text-xs">Noch kein Song</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Song Infos */}
                <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                        {entrie ? entrie.name : "Kein Song gewählt"}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                        {entrie ? entrie.artist : "Warte auf Song..."}
                    </p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="ios-card ios-card--own">
                {/* User Header */}
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        DU
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">Dein Song</p>
                        <p className="text-xs text-gray-500">heute</p>
                    </div>
                </div>

                {/* Album Cover */}
                <div className="relative mb-4">
                    <div className="w-28 h-28 mx-auto bg-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        {entrie ? (
                            <Image 
                                src={entrie.imageSrc} 
                                width={112} 
                                height={112} 
                                alt="Album Cover" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Link href="/add-song" className="w-full h-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors rounded-2xl">
                                <div className="text-center">
                                    <div className="text-3xl mb-1 text-blue-500">+</div>
                                    <p className="text-xs text-blue-600 font-medium">Song hinzufügen</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Song Infos */}
                <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                        {entrie ? entrie.name : "Song hinzufügen"}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                        {entrie ? entrie.artist : "Auf das Plus klicken"}
                    </p>
                </div>
            </div>
        );
    }
}