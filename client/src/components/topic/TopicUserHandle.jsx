/* eslint-disable react/prop-types */
import Topic from "../../modules/topic/Topic";
import ButtonFollowingTopic from "../button/ButtonFollowingTopic";

const TopicUserHandle = ({ data, initialFollowing = false }) => {
  const { id, slug, name, articlesCount, followersCount } = data;

  if (!data) return;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center ">
        <div className="flex items-center py-2 pr-5">
          <Topic to={`topic/${slug}`} className="mr-3 ">
            {name}
          </Topic>
          <div className="flex items-center gap-2 font-semibold text-gray-500">
            <p>{articlesCount} Stories</p>
            <div className="text-2xl -translate-y-1">.</div>{" "}
            <p>{followersCount} Follower</p>
          </div>
        </div>
      </div>
      <ButtonFollowingTopic
        topicId={id}
        initialFollowing={initialFollowing}
      ></ButtonFollowingTopic>
    </div>
  );
};

export default TopicUserHandle;
