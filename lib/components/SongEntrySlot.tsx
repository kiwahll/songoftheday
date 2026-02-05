import mongoose from "mongoose";
import Entry from "../models/Entry";
import { UserData } from "../models/User";
import dbConnect from "../mongodb";
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from "next/headers";
import Reactions from "./Reactions";

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
        }).lean().exec()
        : await Entry.findOne({
            user: new mongoose.Types.ObjectId(code), createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        }).lean();

    const isOwnCard = !user;
    const cardClass = isOwnCard ? "ios-card ios-card--own" : "ios-card";

    return (
        <div className={cardClass}>
            {/* User Header - kleiner und dezenter */}
            <div className="flex items-start justify-between">
                <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-2 ${
                        isOwnCard 
                            ? 'bg-linear-to-br from-blue-500 to-blue-600' 
                            : 'bg-linear-to-br from-gray-400 to-gray-600'
                    }`}>
                        {isOwnCard ? 'DU' : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="username-accent">{isOwnCard ? 'Dein Song' : user.name}</p>
                        <p className="text-xs text-gray-400">heute</p>
                    </div>
                </div>
                {entrie && (
                    <Reactions
                        isOwnCard={isOwnCard}
                        entryId={entrie._id.toString()}
                        currentUserId={code}
                        reactionsData={JSON.stringify(entrie.reactions)}
                    />
                )}
            </div>

            {/* Album Cover - größer und prominenter */}
            <div className="relative mb-3">
                <div className={`w-40 h-40 mx-auto bg-gray-100 rounded-3xl shadow-lg overflow-hidden ring-4 ring-white ring-offset-2 ${
                    isOwnCard ? 'ring-offset-blue-50' : 'ring-offset-gray-50'
                }`}>
                    {entrie ? (
                        <Link href={"https://open.spotify.com/intl-de/track/" + entrie.spotifyId} target="_blank">
                            <Image
                                src={entrie.imageSrc || "https://i.scdn.co/image/ab67616d00001e02b5c53fb3985d4f1aa48bfe77"}
                                width={160}
                                height={160}
                                alt="Album Cover"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center rounded-3xl ${
                            isOwnCard 
                                ? 'bg-linear-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200' 
                                : 'bg-linear-to-br from-gray-50 to-gray-100'
                        }`}>
                            {isOwnCard ? (
                                <Link href="/add-song" className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2 text-blue-500">+</div>
                                        <p className="text-sm text-blue-600 font-medium">Song hinzufügen</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="text-gray-400 text-center">
                                    <div className="text-3xl mb-2">🎵</div>
                                    <p className="text-xs">Noch kein Song</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Song Infos - prominenter */}
            <div className="text-center">
                <h3 className="song-title-bold mb-1 truncate">
                    {entrie ? entrie.name : (isOwnCard ? "Song hinzufügen" : "Kein Song gewählt")}
                </h3>
                <p className="text-gray-700 text-sm truncate font-medium">
                    {entrie ? entrie.artist : (isOwnCard ? "Auf das Plus klicken" : "Warte auf Song...")}
                </p>
            </div>
        </div>
    );
}