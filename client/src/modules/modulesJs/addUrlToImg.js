import { config } from "../../utils/constants";

const addUrlToImg = (img) => {
  if (typeof img !== "string") return;
  if (!img) {
    return "";
  }
  if (
    img.startsWith("https://") ||
    img.startsWith("http://") ||
    img.startsWith("blob:http://")
  ) {
    img;
  } else if (img.includes("assets")) {
    img;
  } else {
    img = `${config.SERVER_HOST}/file/${img}`;
  }
  return img;
};

export default addUrlToImg;
