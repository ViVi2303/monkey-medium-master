import mongoose from "mongoose";

const JsonWebTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    iat: { type: String, required: true },
    exp: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

JsonWebTokenSchema.index({ timestamps: 1 }, { expireAfterSeconds: 259200 });

export default mongoose.model("json-web-token", JsonWebTokenSchema);
