import styled from "styled-components";

const TopicCheckboxStyle = styled.label``;

// eslint-disable-next-line react/prop-types
const TopicCheckbox = ({ checked, children, slug, onChange, ...rest }) => {
  return (
    <TopicCheckboxStyle>
      <input
        checked={checked}
        type="checkbox"
        id={slug}
        className="hidden-input"
        onChange={onChange}
        {...rest}
      />
      <div className="inline-block font-medium cursor-pointer">
        <div
          className={`px-3 py-2 rounded-2xl flex items-center justify-center ${
            checked
              ? "border border-blue-400 text-blue-400"
              : "border  text-black bg-gray-200"
          }`}
        >
          <span className="mr-2 text-sm">{children}</span>
          {checked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
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
                d="M12 6v12m6-6H6"
              />
            </svg>
          )}
        </div>
      </div>
    </TopicCheckboxStyle>
  );
};

export default TopicCheckbox;
