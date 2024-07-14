import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";

const apiGetPendingReportUsers = async (
  token,
  limit = 10,
  skipId = "",
  skipCount = ""
) => {
  console.log('skipId = "", skipCount:', skipId, skipCount);
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/user/pending?limit=${limit}&skipId=${skipId}&skipCount=${skipCount}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetPendingReportStaff = async (
  token,
  limit = 10,
  skipId = "",
  skipCount = ""
) => {
  console.log('skipId = "", skipCount:', skipId, skipCount);
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/staff/pending?limit=${limit}&skipId=${skipId}&skipCount=${skipCount}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetReportedUsers = async (token, userId, limit = 10, skip) => {
  if (!token && !userId) return null;
  if (!skip) skip = "";
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/${userId}/pending?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetUsersResolved = async (token, limit = 10, skip) => {
  if (!token) return null;
  if (!skip) skip = "";
  console.log("skip:", skip);
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-user/resolved?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiResolveReportedUsers = async (token, userId) => {
  console.log("userId:", userId);
  if (!token && !userId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-user/report/${userId}/resolve`,
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
    console.log("error:", error);
  }
};

const apiResolveReportedAllUsers = async (token, userId) => {
  if (!token && !userId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-user/${userId}`,
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
    console.log("error:", error);
  }
};

const apiDeleteMyComment = async (token, commentId) => {
  if (!commentId && !token) return null;
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/comment/${commentId}`,
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

const apiUserSearch = async (token, inputSearch, limit = 10, skip) => {
  if (!inputSearch) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/search?users=${inputSearch}&limit=${limit}&skip=${skip}`,
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

const apiBlogSearch = async (token, inputSearch, limit = 10, skip = "") => {
  if (!inputSearch) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/search?post=${inputSearch}&limit=${limit}&skip=${skip}`,
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

const apiTopicsSearch = async (token, inputSearch = "", limit = 10, skip) => {
  if (!inputSearch) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/search?tag=${inputSearch}&limit=${limit}&skip=${skip}`,
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

const apiGetReadingList = async (token, limit) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/reading-list/me?limit=${limit}`,
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

const apiAddReadingList = async (token, postId) => {
  if (!token) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/reading-list/${postId}`,
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
    console.log("error:", error);
  }
};

const apiDeleteReadingList = async (token, postId) => {
  if (!token) return null;
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/reading-list/${postId}`,
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

const apiReportBlog = async (token, postId, reason) => {
  console.log("postId, reason:", postId, reason);
  if (!token) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/report-article/${postId}`,
      {
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response:", response);
    if (response?.data) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetExploreBlogs = async (token, limit, skip = "") => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/explore-new-articles/?limit=${limit}&skip=${skip}`,
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

const apiGetStaffPick = async (token, limit = 3, skip = "") => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/admin-pick-full-list?limit=${limit}&skip=${skip}`,
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

const apiGetFollowedArticles = async (token, slug, limit = 10, skip = "") => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/topic/${slug}?limit=${limit}&skip=${skip}`,
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

const apiGetMyUserFollowings = async (
  token,
  username,
  limit = 10,
  skip = ""
) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/follow-profile/${username}/following?limit=${limit}&skip=${skip}`,
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

const apiGetPendingReportsArticles = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-article/pending`,
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

const apiGetAllArticlesAdmin = async (
  token,
  limit,
  search = "",
  status = "",
  skip = ""
) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article?limit=${limit}&skip=${skip}&search=${search}&option=${status}`,
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
const apiGetMyMuted = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(`${config.SERVER_HOST}/mute/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiLikeArticle = async (token, blogId) => {
  if (!token && !blogId) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/like/${blogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUnLikeArticle = async (token, blogId) => {
  if (!token && !blogId) return null;
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/like/${blogId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetPendingReasonsReportsArticles = async (token, blogId) => {
  if (!token && !blogId) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-article/${blogId}/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMarkReportBlog = async (token, reportBlogId) => {
  console.log("reportBlogId:", reportBlogId);
  if (!token && !reportBlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-article/report/${reportBlogId}/resolve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMarkAllReportBlog = async (token, BlogId) => {
  if (!token && !BlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/report-article/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiSetBackToDraft = async (token, BlogId, reason) => {
  if (!token && !BlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/set-article-back-to-draft/${BlogId}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetReportsBlogSolved = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/report-article/resolved`,
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

const apiGetBlogsTopic = async (token, slug, limit = 9, skip = "") => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/topic/${slug}?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiSetApproved = async (token, BlogId) => {
  if (!token && !BlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/approve/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetRemovedArticles = async (token, limit = 9, skip = "") => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/removed-articles?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiRestoreArticle = async (token, BlogId) => {
  if (!token && !BlogId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/restore/${BlogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiGetUserLikedBlogs = async (token, blogId, limit = 2, skip = "") => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/like/${blogId}?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiSetStaff = async (token, userId) => {
  if (!token && !userId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/role/make-staff/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    console.log("error:", error);
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiSetUser = async (token, userId) => {
  if (!token && !userId) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/role/make-user/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) return true;
    return false;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiRegister = async (email, password) => {
  if (!email && !password) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/auth/register`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.success) {
      toast.success(response?.data?.message, {
        pauseOnHover: false,
        delay: 200,
      });
    }
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiLogin = async (email, password) => {
  if (!email && !password) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/auth/login-email`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) return response.data;
  } catch (error) {
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiVerifyEmail = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/auth/verify-email`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    return error.response.data;
  }
};

const apiVerifySetupPassword = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/auth/verify-setup-password`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    return error.response.data;
  }
};

const apiVerifyProfile = async (token, formData) => {
  if (!token) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/profile/setup-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiForgotPassword = async (email) => {
  if (!email) return null;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/auth/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

const apiChangeForgotPassword = async (
  token,
  newPassword = "",
  confirmPassword = ""
) => {
  if (!token && !newPassword && !confirmPassword) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/auth/reset-password/${token}`,
      { newPassword, confirmPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.warning(error.response.data.message, {
      pauseOnHover: false,
      delay: 200,
    });
  }
};

export {
  apiGetPendingReportStaff,
  apiVerifySetupPassword,
  apiChangeForgotPassword,
  apiForgotPassword,
  apiVerifyProfile,
  apiVerifyEmail,
  apiLogin,
  apiRegister,
  apiSetUser,
  apiSetStaff,
  apiGetUserLikedBlogs,
  apiRestoreArticle,
  apiGetRemovedArticles,
  apiSetApproved,
  apiGetBlogsTopic,
  apiGetReportsBlogSolved,
  apiSetBackToDraft,
  apiMarkAllReportBlog,
  apiMarkReportBlog,
  apiGetPendingReasonsReportsArticles,
  apiUnLikeArticle,
  apiLikeArticle,
  apiGetMyMuted,
  apiGetAllArticlesAdmin,
  apiGetPendingReportsArticles,
  apiGetPendingReportUsers,
  apiGetReportedUsers,
  apiResolveReportedUsers,
  apiResolveReportedAllUsers,
  apiGetUsersResolved,
  apiDeleteMyComment,
  apiUserSearch,
  apiTopicsSearch,
  apiBlogSearch,
  apiGetReadingList,
  apiAddReadingList,
  apiDeleteReadingList,
  apiReportBlog,
  apiGetExploreBlogs,
  apiGetStaffPick,
  apiGetFollowedArticles,
  apiGetMyUserFollowings,
};
