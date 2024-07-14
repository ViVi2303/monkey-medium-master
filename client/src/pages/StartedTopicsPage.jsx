import styled from "styled-components";
import { Image } from "antd";
import TopicCheckbox from "../modules/topic/TopicCheckbox";
import { Button } from "../components/button";
import { useState } from "react";

const StartedTopicsPageStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
`;

const StartedTopicsPage = () => {
  const initialData = [
    {
      name: "Hentai",
      slug: "hentai",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
    {
      name: "Echi",
      slug: "echi",
      checked: false,
    },
  ];

  const [data, setData] = useState(initialData);

  const handleCheckboxChange = (slug) => {
    setData((prevState) =>
      prevState.map((item) =>
        item.slug === slug ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleTopics = (e) => {
    e.preventDefault();
    console.log("data:", data);
  };

  return (
    <StartedTopicsPageStyle>
      <div className="flex items-center justify-center mt-5 logo">
        <Image
          width={40}
          preview={false}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <h1 className="ml-2 font-serif text-3xl font-semibold">Medium</h1>
      </div>
      <h2 className="mt-20 font-serif text-3xl text-center">
        What are you interested in?
      </h2>
      <p className="mt-5 text-base text-center">Choose three or more.</p>

      <form onSubmit={handleTopics} autoComplete="off">
        <div className="flex flex-wrap gap-4 py-10">
          {data.map((item, index) => (
            <TopicCheckbox
              checked={item.checked}
              key={index}
              slug={item.slug}
              onChange={() => handleCheckboxChange(item.slug)}
            >
              {item.name}
            </TopicCheckbox>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 flex justify-center py-3 bg-white">
          <Button type="submit" className="!h-10 w-52 !z-10">
            Submit
          </Button>
        </div>
      </form>
      <div className="flex justify-center mb-36 ">
        <button className="p-3 text-blue-300 hover:text-blue-500">
          Show more
        </button>
      </div>
    </StartedTopicsPageStyle>
  );
};

export default StartedTopicsPage;
