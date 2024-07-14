/* eslint-disable react/prop-types */
import ButtonFollowingTopic from "../../components/button/ButtonFollowingTopic";

const TopicDisplay = ({ topic }) => {
  if (!topic) return;
  return (
    <>
      <div className="w-full h-[200px] my-12 text-center border-b border-l-stone-300">
        <div className="">
          <h2 className="text-4xl font-bold ">{topic?.name}</h2>
          <div className="flex items-center justify-center my-6 text-gray-400 font-semibold">
            Topic
            <div className="mx-1 -translate-y-1">.</div>
            {topic?.followersCount} Followers
            <div className="mx-1 -translate-y-1">.</div>
            {topic?.articlesCount} Stories
          </div>
          <ButtonFollowingTopic
            topicId={topic?.id}
            initialFollowing={topic?.isFollowed}
          ></ButtonFollowingTopic>
        </div>
      </div>
    </>
  );
};

export default TopicDisplay;
