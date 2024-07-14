import fileController from "../controllers/fileController.js";

const validator = (schema, property = "body") => {
  return async (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (!error) {
      next();
    } else {
      if (req.file) await fileController.autoRemoveImg(req.file.filename);

      console.log("ERROR VALIDATING =>", error);

      const { details } = error;

      let errMessage = details[0].message.split(`"`).join("");

      errMessage = errMessage.charAt(0).toUpperCase() + errMessage.slice(1);

      res.status(422).json({ success: false, message: errMessage });
    }
  };
};

export default validator;
