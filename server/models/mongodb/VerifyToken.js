import mongoose from "mongoose";

const VerifyTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

VerifyTokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("Verify-Token", VerifyTokenSchema);
