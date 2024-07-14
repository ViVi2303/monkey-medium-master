import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

let token;
setTimeout(() => {
  token = localStorage.getItem("token");
}, 100);
const apiAddTopic = async (token, name) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/topic`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success("Add successfully!", {
        pauseOnHover: false,
        delay: 300,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return toast.error(error.response.data.message, {
        pauseOnHover: false,
        delay: 500,
      });

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiDeleteArticle = async (blogId) => {
  try {
    const res = await axios.delete(`${config.SERVER_HOST}/article/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res?.data.success) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};
const apiDeleteAdminArticle = async (token, blogId) => {
  try {
    const res = await axios.delete(
      `${config.SERVER_HOST}/article/remove/${blogId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res?.data.success) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiDeleteTopic = async (token, id) => {
  try {
    const response = await axios.delete(`${config.SERVER_HOST}/topic/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      toast.success("Deleted successfully!", {
        pauseOnHover: false,
        delay: 500,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return Swal.fire("Deleted!", "Your post has been deleted.", "success");

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiFollowTopic = async (token, topicId) => {
  const res = await axios
    .post(
      `${config.SERVER_HOST}/follow-topic/${topicId}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => {
      if (err.response.status == 404) {
        toast.error("Can not find topic!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    });

  if (res?.data?.success) {
    return true;
  }

  return false;
};

const apiUnFollowTopic = async (token, topicId) => {
  const res = await axios
    .delete(`${config.SERVER_HOST}/follow-topic/${topicId}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      if (err.response.status == 404) {
        toast.error("Can not find topic!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    });
  console.log("res:", res);

  if (res.data.success) {
    return true;
  }

  return false;
};

const apiFollowUser = async (userID, token) => {
  const res = await axios
    .post(
      `${config.SERVER_HOST}/follow-profile/${userID}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .catch((error) => {
      toast.warning(error.response.data.message, {
        pauseOnHover: false,
        delay: 200,
      });
    });
  if (res?.data?.success) {
    return true;
  }
  return false;
};

const apiGetAllUser = async (token, limit = "10", skip = "", search = "") => {
  if (!token) return;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/user?limit=${limit}&skip=${skip}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
    console.log("response.data:", response);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

const apiGetAllStaff = async (token, limit = "10", skip = "", search = "") => {
  if (!token) return;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/role/staffs?limit=${limit}&skip=${skip}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
    console.log("response.data:", response);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

const apiGetArticle = async (token, slug) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/article/${slug} `, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

const apiGetArticleAdminDetail = async (token, blogId) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/detail/${blogId} `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetArticleOrDraft = async (slug) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/get/${slug} `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response?.data;
  } catch (error) {
    console.log("error: ", error);
  }
};
const apiDeleteDraft = async (id) => {
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/article/draft/delete-draft/${id} `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response?.data;
  } catch (error) {
    console.log("error: ", error);
  }
};
const apiGetArticleSkip = async (skipId, token, limit = 5) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article?skip=${skipId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiAddComment = async (blogId, parentCommentId, content, token) => {
  if ((!blogId, !content, !token)) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/comment/${blogId}`,
      {
        parentCommentId,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetComment = async (slug, token) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/comment/${slug} `, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetCommentReplies = async (token, id) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/comment/${id}/replies `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetMyFollowingTopics = async (token) => {
  if (!token) return undefined;
  try {
    const response = await axios.get(`${config.SERVER_HOST}/follow-topic/me`, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetNotification = async (token) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/notification/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};
const apiMarkAsReadNotification = async () => {
  try {
    const res = await axios.patch(
      `${config.SERVER_HOST}/notification/mark-all-as-readed`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res?.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};
const apiGetProfile = async (token, username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetTopic = async (token, slug) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/topic/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Topic not found!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

const apiGetTopics = async (
  token,
  limit = "10",
  search = "",
  option = "",
  skip = ""
) => {
  console.log('skip = "":', skip);
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/topic?limit=${limit}&search=${search}&skip=${skip}&option=${option}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiGetUserBlogs = async (username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/article/${username}/all`, {})
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return [];
    }
    return res.data.articles;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetUserFollowings = async (username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/follow-profile/${username}/following`, {})
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return [];
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMyArticleFollowing = async (token, limit = 5, skip = "") => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/following?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiSuggestionTopics = async (token, max) => {
  if (!token) return undefined;
  if (!max) max = 8;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/topic/recommended-topics?max=${max}`,
      {
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiSuggestionUsers = async (token, max = 5) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/follow-profile/who-to-follow?max=${max}`,
      {
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUnFollowUser = async (userID, token) => {
  const res = await axios
    .delete(`${config.SERVER_HOST}/follow-profile/${userID}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      toast.warning(error.response.data.message, {
        pauseOnHover: false,
        delay: 200,
      });
    });
  if (res?.data.success) {
    return true;
  }

  return false;
};

const apiUpdateArticle = async (token, slug, formData) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/update/${slug}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) return true;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Post not found!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

const apiUpdateTopic = async (token, id, name) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/topic/${id}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success("Update successfully!", {
        pauseOnHover: true,
        delay: 200,
      });
      return true;
    }
  } catch (error) {
    console.log("error:", error);
    if (error.response.status === 409)
      return toast.error(error.response.data.message, {
        pauseOnHover: true,
        delay: 200,
      });

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiUpdateBan = async (token, userId, banType) => {
  if ((!token, !userId)) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/update-ban/${userId}`,
      {
        banType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiBanUser = async (token, userId, banType) => {
  if (!userId && !banType && !token) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/ban/${userId}`,
      {
        banType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiLiftTheBan = async (token, userId) => {
  if (!userId && !token) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/unban/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiUpdateProfile = async (token, formData) => {
  try {
    const res = await axios.patch(
      `${config.SERVER_HOST}/profile/me/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMuteUser = async (type = "post", token, userId) => {
  try {
    const data = await fetch(`${config.SERVER_HOST}/mute/${userId}`, {
      method: type,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    console.log("data:", data);
    if (data?.success) {
      toast.success(data.message, {
        pauseOnHover: false,
        delay: 200,
      });
      return true;
    }
    return false;
  } catch (error) {
    toast.warning(error.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiBlockUser = async (type = "post", token, userId) => {
  try {
    const data = await fetch(`${config.SERVER_HOST}/block/${userId}`, {
      method: type,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });

    if (!data?.success) {
      toast.warning(data.message, {
        pauseOnHover: true,
        delay: 300,
      });
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiApproveTopic = async (token, id) => {
  try {
    const data = await axios.patch(
      `${config.SERVER_HOST}/topic/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("data:", data);
    if (!data.data.success) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiRejectTopic = async (token, id) => {
  try {
    const data = await axios.patch(
      `${config.SERVER_HOST}/topic/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("data:", data);
    if (!data.data.success) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiReportUser = async (token, userId, reason, description) => {
  try {
    const res = await fetch(`${config.SERVER_HOST}/report-user/${userId}`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason, description }),
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
    return res;
  } catch (error) {
    console.log("error:", error);
  }
};

export {
  apiGetArticleAdminDetail,
  apiGetAllStaff,
  apiRejectTopic,
  apiDeleteAdminArticle,
  apiGetTopic,
  apiAddTopic,
  apiAddComment,
  apiBanUser,
  apiDeleteArticle,
  apiDeleteTopic,
  apiLiftTheBan,
  apiFollowTopic,
  apiFollowUser,
  apiGetAllUser,
  apiGetArticle,
  apiGetArticleOrDraft,
  apiDeleteDraft,
  apiGetArticleSkip,
  apiGetComment,
  apiGetCommentReplies,
  apiGetMyFollowingTopics,
  apiGetNotification,
  apiMarkAsReadNotification,
  apiGetProfile,
  apiGetTopics,
  apiGetUserBlogs,
  apiGetUserFollowings,
  apiMyArticleFollowing,
  apiSuggestionTopics,
  apiSuggestionUsers,
  apiUnFollowUser,
  apiUpdateArticle,
  apiUpdateTopic,
  apiUpdateBan,
  apiUnFollowTopic,
  apiUpdateProfile,
  apiApproveTopic,
  apiMuteUser,
  apiBlockUser,
  apiReportUser,
};
