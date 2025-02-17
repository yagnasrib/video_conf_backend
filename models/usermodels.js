import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    username: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
