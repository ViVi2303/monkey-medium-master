import mongoose from "mongoose";

const setupPasswordTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

setupPasswordTokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("setup-password-Token", setupPasswordTokenSchema);
