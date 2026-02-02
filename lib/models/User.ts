import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

export interface UserData {
    _id: string,
    name: string,
    email: string
}