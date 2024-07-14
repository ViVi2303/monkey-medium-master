import addUrlToImg from "../utils/addUrlToImg.js";

const replaceImgNamesWithUrls = (content) => {
  const modifiedContent = content.replace(
    /<img[^>]*src="([^"]*)"[^>]*>/g,
    (match, imgName) => {
      return `<img src="${addUrlToImg(imgName)}">`;
    }
  );

  return modifiedContent;
};

export default replaceImgNamesWithUrls;
