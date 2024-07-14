/* eslint-disable react/prop-types */

const ActionDelete = ({ onClick = () => {} }) => {
  return (
    <span
      className="flex items-center justify-center w-8 h-8 transition-all border border-gray-200 rounded cursor-pointer hover:bg-red-400 hover:text-white"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
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
    </span>
  );
};

export default ActionDelete;
