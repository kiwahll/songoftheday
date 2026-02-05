import mongoose, { Schema } from "mongoose";

const FriendRequestSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    potentialFriendId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);

export enum FriendRequestStatus {
    pending,
    approved,
    denied
}