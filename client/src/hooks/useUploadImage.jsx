import { useState } from "react";
import { apiDeleteImage, apiUploadImage } from "../api/apiNew";
import { config } from "../utils/constants";

const useUploadImage = () => {
  const [image, setImage] = useState("");

  const onUploadImage = async (file) => {
    const response = await apiUploadImage(file);
    if (response?.data?.filename) {
      const filename = response?.data?.filename;
      const url = `${config.SERVER_HOST}/file/${filename}`;
      setImage({ url, filename });
    }
  };

  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert("Choose inly .jpeg .jpg .png .gif");
      e.target.value = "";
      return;
    }
    onUploadImage(file);
  };

  const onDeleteImage = async (filename) => {
    apiDeleteImage(filename);
    setImage("");
  };
  return {
    image,
    setImage,
    onSelectImage,
    onDeleteImage,
  };
};

export default useUploadImage;
