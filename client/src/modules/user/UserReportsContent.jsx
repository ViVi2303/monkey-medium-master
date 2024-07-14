/* eslint-disable react/prop-types */
import { useState } from "react";

const UserReportsContent = ({ reason, description }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Reason: <span className="text-gray-600">{reason}</span>{" "}
      </p>
      {description && (
        <p
          className={`mt-3 content font-medium text-sm ${
            !showMore && "line-clamp-2"
          }`}
        >
          Description:{" "}
          <span className="text-sm text-gray-600">{description}</span>
        </p>
      )}

      {description?.length && description?.length > 150 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-green-400 transition-all hover:text-green-600"
        >
          {showMore ? "Hide" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default UserReportsContent;
