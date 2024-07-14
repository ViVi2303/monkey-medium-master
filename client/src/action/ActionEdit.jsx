/* eslint-disable react/prop-types */

const ActionEdit = ({ onClick = () => {} }) => {
  return (
    <span
      className="flex items-center justify-center w-8 h-8 transition-all border border-gray-200 rounded cursor-pointer hover:bg-green-400 hover:text-white"
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
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </span>
  );
};

export default ActionEdit;
