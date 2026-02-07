import mongoose, { Schema } from "mongoose";

const reactionSchema = new mongoose.Schema({
    emoji: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { _id: false } // kein extra _id pro Reaction nötig
);

const EntrySchema: Schema = new Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    songId: { type: String, required: true },
    platform: { type: String, required: true },
    songUrl: { type: String, required: true },
    imageSrc: String,
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    reactions: { type: [reactionSchema], default: [] }
}, { timestamps: true });

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

export enum SongPlatform {
    SPOTIFY = "spotify",
    SOUNDCLOUD = "soundcloud"
}
