import crypto from "crypto";

const randomBytes = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

export default randomBytes;
