import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import WriteHeader from "../layout/WriteHeader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import InputHook from "../components/input/InputHook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import MyEditor from "../components/input/MyEditor";
import { apiGetArticleOrDraft, apiUpdateArticle } from "../api/api";
import useUploadImage from "../hooks/useUploadImage";
import { config } from "../utils/constants";
import { apiAddBlog, apiUpdateDarft } from "../api/apiNew";
import { debounce } from "lodash";

const EditBlogPageStyle = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .content {
  }
`;

const schema = yup.object({
  title: yup.string().required("Please fill out your title"),
});

const EditBlogPage = () => {
  const token = localStorage.getItem("token");
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { slug } = useParams("slug");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showIsSaved, setShowIsSaved] = useState(false);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState();
  const [preview, setPreview] = useState("");
  const { image, setImage, onSelectImage, onDeleteImage } = useUploadImage();

  const navigate = useNavigate();
  function resetForm(data) {
    console.log("data:", data);
    if (!data) return;
    if (data.length === 0) return;
    const title = data?.title;
    const preview = data?.preview;
    reset({ title, preview });
    setStatus({ id: data.id, status: data.status });
    if (data.banner) {
      setImage({
        url: `${config.SERVER_HOST}/file/${data?.banner}`,
        filename: data?.banner,
      });
    }
    setContent(data?.content);
    setTopics(data?.topicNames);
  }

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await apiGetArticleOrDraft(slug);
        if (response) resetForm(response.data);
      } catch (error) {
        // navigate("/*");
        console.log("error", error);
      }
    }
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const arrErrs = Object.values(errors);
    if (arrErrs.length > 0) {
      toast.error(arrErrs[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  // useEffect(() => {
  //   const topicsId = topics?.map((topic) => topic._id);
  //   console.log("topicsId", topicsId);
  //   setValue("topics", topicsId);
  // }, [setValue, topics]);

  useEffect(() => {
    setValue("content", content);
  }, [content, setValue]);

  useEffect(() => {
    const contentClone = content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentClone, "text/html");
    const textContent = doc.body.textContent;

    setPreview(textContent);
    setValue("preview", preview);
  }, [content, preview, setValue]);

  const handleSelectImage = (e) => {
    if (image) return;
    onSelectImage(e);
  };

  const handleDeleteImage = () => {
    onDeleteImage(image?.filename);
  };

  const handleClickPublish = () => {
    handleSubmit(handleEditBlog)();
  };

  const handleEditBlog = async (values) => {
    if (!isValid) return;
    if (!token) return null;
    const { title, content, preview } = values;
    let response;
    const cutPreview = preview.slice(0, 200);
    const getTopicNames = topics.map((val) => val.name);
    const topicsSplit = topicInput.trim().split(/,+/).filter(Boolean);
    const topicsMap = topicsSplit.map((val) => val.trim());
    const topicNames = [...getTopicNames, ...topicsMap];
    if (status?.status == "draft") {
      const data = {
        topicNames,
        preview: cutPreview,
        banner: image.filename,
      };
      response = await apiAddBlog(status?.id, data);
    } else {
      const formData = {
        title,
        content,
        topicNames,
        preview,
        banner: image.filename,
      };
      response = await apiUpdateArticle(token, status?.id, formData);
    }
    if (response) {
      navigate(`/`);
    }
  };
  const watchedTitle = useWatch({ control, name: "title", defaultValue: "" });
  const UpdateDraft = debounce(async () => {
    const res = await apiUpdateDarft(status?.id, watchedTitle, content);
    if (res?.success) {
      setIsSaved(true);
    }
  }, 1000);

  useEffect(() => {
    // console.log("title",watchedTitle);
    // console.log("content",content);
    const check = content !== "" && watchedTitle !== "";
    if (!check) return;
    setIsSaved(false);
    const encoder = new TextEncoder();
    const byteSize = encoder.encode(content).length;
    if (byteSize >= 30000) {
      return;
    }
    if (status.status == "draft") {
      setShowIsSaved(true);
      UpdateDraft();
    }
    // console.log("newDraft",newDraft);
    // console.log("changeDraft",changeDraft);
  }, [watchedTitle, content]);
  return (
    <EditBlogPageStyle>
      <form onSubmit={handleSubmit(handleEditBlog)} autoComplete="off">
        <WriteHeader
          topicInput={topicInput}
          setTopicInput={setTopicInput}
          showIsSaved={showIsSaved}
          isSaved={isSaved}
          image={image.url}
          handleSelectImage={handleSelectImage}
          handleDeleteImage={handleDeleteImage}
          topics={topics}
          setTopics={setTopics}
          token={token}
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
          handleClickPublish={handleClickPublish}
        />
        <InputHook
          className=""
          control={control}
          name="title"
          placeholder="Add title"
        ></InputHook>
        <MyEditor content={content} setContent={setContent}></MyEditor>
      </form>
    </EditBlogPageStyle>
  );
};

export default EditBlogPage;
