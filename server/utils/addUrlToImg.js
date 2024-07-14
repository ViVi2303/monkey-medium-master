import env from "../config/env.js";

const addUrlToImg = (img) => {
  if (!img) {
    return "";
  }
  if (img.startsWith("https://") || img.startsWith("http://")) {
    img;
  } else {
    img = `${env.SERVER_HOST}:${env.SERVER_PORT}/${env.API_VERSION}/file/${img}`;
  }
  return img;
};

export default addUrlToImg;
