import mongoose, { Schema } from "mongoose";

const FriendRequestSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    potentialFriendId: { type: Schema.Types.ObjectId, required: true },
    status: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);

export enum FriendRequestStatus {
    pending = 0,
    approved = 1,
    denied = 2
}