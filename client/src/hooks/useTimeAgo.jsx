const useTimeAgo = (createdAt = "") => {
  const startDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate - startDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (hours < 168) {
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    const formatDate = new Date(startDate).toLocaleDateString("vi-VI");
    return formatDate;
  }
};

export default useTimeAgo;
