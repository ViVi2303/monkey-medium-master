import getError from "../utils/getError.js";
import fileController from "../controllers/fileController.js";

const checkFileLimit = (limit) => async (req, res, next) => {
  try {
    const filename = req.file?.filename;
    const size = req.file?.size;

    const FILE_LIMIT = limit * 1024 * 1024;

    if (size && size > FILE_LIMIT) {
      await fileController.autoRemoveImg(filename);
      return res.status(400).json({
        success: false,
        message: "File too large",
      });
    }

    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }
};

export default checkFileLimit;
