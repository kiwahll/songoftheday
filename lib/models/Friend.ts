import mongoose, { Schema } from "mongoose";

const FriendSchema: Schema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true });

export default mongoose.models.Friend || mongoose.model('Friend', FriendSchema);
