import mongoose from "mongoose";

const socketUserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    socketId: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Socket-User", socketUserSchema);
