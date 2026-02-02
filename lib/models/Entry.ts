import mongoose, { Schema } from "mongoose";
import { UserData } from "./User";

const EntrySchema: Schema = new Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    spotifyId: { type: String, required: true },
    imageSrc: String,
    user: { type: mongoose.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
