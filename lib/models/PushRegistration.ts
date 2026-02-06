import mongoose, { Schema } from "mongoose";

const PushRegistrationSchema: Schema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    subscription: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.PushRegistration || mongoose.model('PushRegistration', PushRegistrationSchema);
