/* eslint-disable react/prop-types */
import { useState } from "react";
import Avatar from "../../modules/user/Avatar";

const CommentUserChildren = ({ img }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="py-2 border-t border-gray-200 comment-parents">
      <div className="flex items-center gap-3 info">
        <Avatar url={img} size="small"></Avatar>
        <div className="content-info">
          <h3 className="font-medium">Duc hung 1</h3>
          <div className="text-gray-400 time">About 1 hour ago</div>
        </div>
      </div>
      <div className={`mt-3 content ${!showMore && "line-clamp-3"}`}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Exercitationem, deleniti aliquam libero nulla consectetur autem incidunt
        non eligendi, facere nihil voluptates neque. Repellendus deleniti, sequi
        optio ipsum omnis quo consectetur!
      </div>
      {!showMore && (
        <button
          onClick={() => setShowMore(true)}
          className="text-green-400 transition-all hover:text-green-600"
        >
          Show more
        </button>
      )}

      <div className="comment-children"></div>
    </div>
  );
};

export default CommentUserChildren;
