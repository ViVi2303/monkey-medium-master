/* eslint-disable react/prop-types */
import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TopicSlider = ({ topics = [] }) => {
  const [activeSlide, setActiveSlide] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const topicSlug = searchParams.get("topic");
    if (topicSlug) return;
    setActiveSlide("");
  }, [searchParams]);

  const handleClick = (slug) => {
    setActiveSlide(slug);
    setSearchParams({ topic: slug });
  };

  return (
    <SliderStyle>
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={"auto"}
        autoHeight={true}
      >
        {topics.map((val) => (
          <SwiperSlide key={val.id}>
            <button
              className={`${val.slug === activeSlide ? "active" : ""}`}
              onClick={() => handleClick(val.slug)}
            >
              {val.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderStyle>
  );
};

export default TopicSlider;

const SliderStyle = styled.div`
  .swiper {
    width: 100%;
    margin: 15px 0 10px 0;
  }

  .swiper-slide {
    width: auto;
    border-radius: 18px;
    margin: 0 10px;
    color: #808e9b;
    transition: all 0.2s;
    &:hover {
      color: #222;
    }
  }
  .swiper-slide:first-child {
    margin: 0 10px 0 42px;
  }

  .active {
    color: #222;
  }
  .swiper-button-next {
    background-color: #ffffff;
    color: black;
    transform: translateX(10px);
    user-select: none;
  }
  .swiper-button-next::before {
    content: "";
    background-color: #ffffff;
    height: 150%;
    width: 30px;
    position: absolute;
    top: -10px;
    left: -20px;
    filter: blur(4px);
    opacity: 0.95;
    z-index: -1;
    border-radius: 20px;
  }
  .swiper-button-next::after {
    font-size: 10px;
    font-weight: 600;
  }
  .swiper-button-disabled {
    opacity: 0;
  }
  .swiper-button-prev {
    background-color: #ffffff;
    color: black;
    transform: translateX(-10px);
  }
  .swiper-button-prev::before {
    content: "";
    background-color: #ffffff;
    height: 150%;
    width: 30px;
    position: absolute;
    top: -10px;
    right: -20px;
    filter: blur(4px);
    opacity: 0.95;
    z-index: -1;
    border-radius: 20px;
  }
  .swiper-button-prev::after {
    font-size: 10px;
    font-weight: 600;
  }
  a {
    display: flex;
    padding: 10px 10px 8px;
    font-size: 14px;
    align-items: center;
    border-radius: 18px;
    max-height: 38px;
  }
`;
