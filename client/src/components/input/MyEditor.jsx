/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import { config } from "../../utils/constants";
import { apiDeleteImage, apiUploadImage } from "../../api/apiNew";

Quill.register("modules/imageUploader", ImageUploader);

const MyEditor = ({ content, setContent }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const quillRef = useRef();
  const deleteImage = (filename) => {
    apiDeleteImage(filename);
  };

  useEffect(() => {
    if (
      quillRef.current?.lastDeltaChangeSet?.ops[1]?.delete === 1 &&
      imageFiles.length > 0
    ) {
      for (let index = 0; index < imageFiles.length; index++) {
        if (!quillRef.current?.value.includes(imageFiles[index].path)) {
          const tempImageFiles = structuredClone(imageFiles);
          // console.log("tempImageFiles:", tempImageFiles);
          const filteredImageFiles = tempImageFiles.filter(
            (image) => image.id !== imageFiles[index].id
          );
          deleteImage(imageFiles[index]?.filename);
          // console.log("filteredImageFiles:", filteredImageFiles);

          setImageFiles(filteredImageFiles);
        }
      }
    }
  }, [quillRef.current?.lastDeltaChangeSet?.ops[1]]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["link", "image"],
        ],
      },
      imageUploader: {
        upload: async (file) => {
          const response = await apiUploadImage(file);
          // console.log(response);
          if (response.data.filename) {
            const filename = response.data.filename;
            const src = `${config.SERVER_HOST}/file/${filename}`;
            // console.log("src:", src);
            const date = Date.now();
            setImageFiles((prev) => [
              ...prev,
              { path: src, id: date, filename },
            ]);
            return src;
          }
          return;
        },
      },
    }),
    []
  );

  const handleChangeContent = (value) => {
    setContent(value);
  };

  return (
    <div className="content entry-content">
      <ReactQuill
        ref={quillRef}
        modules={modules}
        theme="snow"
        value={content}
        onChange={handleChangeContent}
      />
    </div>
  );
};

export default MyEditor;
