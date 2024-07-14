// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";

const SearchStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 20px;
  padding: 10px;
  transition: 0.3s;

  .icon-search {
    flex-shrink: 0;
  }
  .search-main {
    flex: 1 1 auto;
    margin-left: 5px;
    font-size: 14px;
    &::placeholder {
      font-size: 14px;
      transition: 0.3s;
      color: ${(props) => props.theme.black};
    }
    &:focus {
      &::placeholder {
        opacity: 0;
      }
    }
  }
  @media screen and (max-width: 768px) {
  }
`;

// eslint-disable-next-line react/prop-types
const SearchMain = ({ onChange, className }) => {
  return (
    <SearchStyled className={className}>
      <div className="icon-search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="search-main"
        placeholder="Search"
        onChange={onChange}
      />
    </SearchStyled>
  );
};

export default SearchMain;
