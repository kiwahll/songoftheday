import mongoose from "mongoose";
import Entry from "../models/Entry";
import { UserData } from "../models/User";
import dbConnect from "../mongodb";
import { currentUserId } from "../utils";
import Image from 'next/image';
import { Suspense } from "react";

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
            <section className="flex-1 flex items-center justify-center">
                <div className="text-center px-8">
                    {/* User Badge */}
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600`}>
                            {user.name}
                        </span>
                    </div>

                    {/* Album Cover */}
                    <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg shadow-lg">
                        {entrie ? <Image src="https://i.scdn.co/image/ab67616d00001e02b5c53fb3985d4f1aa48bfe77" width={300} height={300} alt="Plus" /> : <div></div>}
                    </div>

                    {/* Song Infos */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{entrie ? entrie.name : "Noch kein SoD :("}</h2>
                    <p className="text-gray-600">{entrie ? entrie.artist : "-"}</p>
                </div>
            </section>
        );
    } else {
        return (
            <section className="flex-1 flex items-center justify-center">
                <div className="text-center px-8">
                    {/* User Badge */}
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800
                            `}>
                            Dein Song
                        </span>
                    </div>

                    {/* Album Cover */}
                    <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg shadow-lg">
                        {entrie ? <Image src={entrie.imageSrc} width={300} height={300} alt="Plus" /> : <div className="w-full h-full flex items-center justify-center">
                            <Image src="/plus.png" width={80} height={80} alt="Plus" />
                        </div>}
                    </div>

                    {/* Song Infos */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{entrie ? entrie.name : "Song hinzufügen"}</h2>
                    <p className="text-gray-600">{entrie ? entrie.artist : "Auf das Plus klicken"}</p>
                </div>
            </section>
        );
    }
}