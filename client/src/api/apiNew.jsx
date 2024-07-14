import axios from "axios";
import { config } from "../utils/constants";
let token;
setTimeout(() => {
  token = localStorage.getItem("token");
}, 100);
const apiGetUserFollow = async (username, typeFollow = "followers") => {
  try {
    const res = await fetch(
      `${config.SERVER_HOST}/follow-profile/${username}/${typeFollow}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
    return res;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUploadCheckImage = async (file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("avatar", file);
    const response = await axios({
      method: "post",
      url: `${config.SERVER_HOST}/file/avatar`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log("error:", error);
  }
};
const apiUploadImage = async (file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("img", file);
    const response = await axios({
      method: "post",
      url: `${config.SERVER_HOST}/file/img`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiDeleteImage = async (filename) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${config.SERVER_HOST}/file/${filename}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiCreateDarft = async (title, content) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/article/draft/create-draft`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUpdateDarft = async (id, title, content) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/draft/update-draft/${id}`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiDeleteDarft = async (id) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${config.SERVER_HOST}/article/draft/delete-draft/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiAddBlog = async (aricleId, formData) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/article/${aricleId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

const apiGetMyDraft = async () => {
  try {
    const res = await fetch(`${config.SERVER_HOST}/article/draft/me`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    return res;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetReadingHistory = async () => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/reading-history/me `,
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
const apiGetMoreArticleInDetailPage = async (articleId) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/more-articles-from-profile/${articleId} `,
      {},
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
const apiDeleteReadingHistory = async () => {
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/reading-history/me/clear `,
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
const apiDeleteAllNotification = async () => {
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/notification/clear `,
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
const apiDeleteArticleHistory = async (id) => {
  try {
    const response = await axios.delete(
      `${config.SERVER_HOST}/reading-history/${id} `,
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
const apiGetMyBlocked = async () => {
  if (!token) return null;
  try {
    const response = await axios.get(`${config.SERVER_HOST}/block/me`, {
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
const apiChangePassword = async (oldPassword, newPassword, confirmPassword) => {
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/me/change-password`,
      { oldPassword, newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log("error:", error);
  }
};
export {
  apiGetUserFollow,
  apiUploadImage,
  apiDeleteImage,
  apiCreateDarft,
  apiUpdateDarft,
  apiDeleteDarft,
  apiAddBlog,
  apiUploadCheckImage,
  apiGetMyDraft,
  apiGetReadingHistory,
  apiDeleteReadingHistory,
  apiDeleteArticleHistory,
  apiDeleteAllNotification,
  apiGetMyBlocked,
  apiGetMoreArticleInDetailPage,
  apiChangePassword,
};
