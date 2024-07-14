const replaceImgUrlsWithNames = (content) => {
  const modifiedContent = content.replace(
    /<img[^>]*src="([^"]*)"[^>]*>/g,
    (match, imgUrl) => {
      const imgName = imgUrl.split("/").pop();
      return `<img src="${imgName}">`;
    }
  );

  return modifiedContent;
};

export default replaceImgUrlsWithNames;
