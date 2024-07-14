/* eslint-disable react/prop-types */
import { Fragment } from "react";
import iconUpload from "../../assets/img-upload.png";

const ImageUpload = (props) => {
  const {
    name,
    className = "",
    image = "",
    handleDeleteImage = () => {},
    ...rest
  } = props;

  return (
    <Fragment>
      <div
        className={`cursor-pointer flex items-center justify-center border border-gray-300 w-full min-h-[200px]  ${className} relative overflow-hidden group`}
      >
        <label>
          <input
            type="file"
            name={name}
            className="hidden-input"
            accept="image/gif, image/jpeg, image/png"
            onChange={() => {}}
            {...rest}
          />

          {!image && (
            <div className="flex flex-col items-center text-center cursor-pointer">
              <img
                src={iconUpload}
                alt="upload-img"
                className="max-w-[80px] mb-5 "
              />
              <p className="font-semibold ">Choose photo</p>
            </div>
          )}
        </label>

        {image && (
          <Fragment>
            <img
              src={image}
              className="z-0 object-cover w-full h-full min-h-[200px]"
              alt=""
            />
            <button
              type="button"
              className="absolute z-10 flex items-center justify-center invisible w-16 h-16 text-red-500 transition-all bg-white rounded-full opacity-0 cursor-pointer group-hover:opacity-100 group-hover:visible"
              onClick={handleDeleteImage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default ImageUpload;
