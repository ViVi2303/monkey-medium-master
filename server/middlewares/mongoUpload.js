import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";
import env from "../config/env.js";

const storage = new GridFsStorage({
  url: env.getMongodbUri(),
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = { filename, bucketName: env.MONGODB_BUCKET };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  const { originalname } = file;
  if (!originalname.match(/\.(jpg|png|jpeg)$/i)) {
    return cb(new Error("only support jpg, png and jpeg formats"));
  }
  cb(null, true);
};

const mongoUpload = multer({ storage, fileFilter });

export default mongoUpload;
