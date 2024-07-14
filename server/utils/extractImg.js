const extracImg = (content) => {
  const imgsName = (content.match(/<img[^>]*src="([^"]*)"[^>]*>/g) || []).map(
    (imgTag) =>
      imgTag
        .match(/src="([^"]*)"/)[1]
        .split("/")
        .pop()
  );

  return imgsName;
};

export default extracImg;
