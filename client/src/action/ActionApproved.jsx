/* eslint-disable react/prop-types */

const ActionApproved = ({ onClick = () => {} }) => {
  return (
    <span
      className="flex items-center justify-center w-8 h-8 transition-all border border-gray-200 rounded cursor-pointer hover:bg-green-400 hover:text-white"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    </span>
  );
};

export default ActionApproved;
