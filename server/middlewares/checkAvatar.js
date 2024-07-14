import getError from "../utils/getError.js";
import fileController from "../controllers/fileController.js";
import env from "../config/env.js";
import clarifai from "../services/clarifai.js";
import MongoDB from "../databases/mongodb/connect.js";

const checkAvatar = async (req, res, next) => {
  try {
    const filename = req.file?.filename;

    if (filename) {
      const size = req.file?.size;

      const FILE_LIMIT = env.AVATAR_FILE_SIZE_LIMIT * 1024 * 1024;

      if (size && size > FILE_LIMIT) {
        await fileController.autoRemoveImg(filename);
        return res.status(400).json({
          success: false,
          message: "File too large",
        });
      }

      const gfs = MongoDB.gfs;

      const files = await gfs.find({ filename }).toArray();

      if (!files || !files.length) {
        return;
      }

      const readStream = gfs.openDownloadStreamByName(filename);

      let chunks = [];

      readStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      await new Promise((resolve, reject) => {
        readStream.on("end", () => {
          const imgData = Buffer.concat(chunks).toString("base64");

          clarifai(imgData, async (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (results[0][0].nsfw > 0.55) {
              await fileController.autoRemoveImg(filename);

              return res.status(400).json({
                success: false,
                message:
                  "Your image contains explicit content and is not allowed",
              });
            }

            resolve();
          });
        });
      });
    }

    next();
  } catch (error) {
    console.log(error);
    const err = getError(error);
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }
};

export default checkAvatar;
