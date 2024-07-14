/* eslint-disable react/prop-types */

const ClearAll = ({ title, titlebtn, handleDelete }) => {
  return (
    <>
      <div className="rounded-sm text-base flex items-center justify-between w-full py-6 px-4 bg-stone-200">
        <div className="">
          <p>{title}</p>
        </div>
        <div className="">
          <button
            className="bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600 "
            onClick={handleDelete}
          >
            {titlebtn}
          </button>
        </div>
      </div>
    </>
  );
};

export default ClearAll;
