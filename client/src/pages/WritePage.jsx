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
import { useNavigate } from "react-router-dom";
import MyEditor from "../components/input/MyEditor";
import { apiAddBlog, apiCreateDarft, apiUpdateDarft } from "../api/apiNew";
import { debounce } from "lodash";
import useUploadImage from "../hooks/useUploadImage";

const WritePageStyle = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .content {
  }
`;

const schema = yup.object({
  title: yup.string().required("Please fill out your title").min(4),
});

const WritePage = () => {
  const token = localStorage.getItem("token");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showIsSaved, setShowIsSaved] = useState(false);
  const [newDraft, setNewDraft] = useState({});
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const navigate = useNavigate();
  const { image, onSelectImage, onDeleteImage } = useUploadImage();
  useEffect(() => {
    const arrErrs = Object.values(errors);
    if (arrErrs.length > 0) {
      toast.error(arrErrs[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  useEffect(() => {
    const topicsId = topics.map((topic) => topic.id);
    setValue("topics", topicsId);
  }, [setValue, topics]);

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

  const handleAddBlog = (values) => {
    if (!isValid) return;
    // if (!image) {
    //   toast.error("Please fill out your image title!", {
    //     pauseOnHover: false,
    //     delay: 500,
    //   });
    //   return;
    // }
    const { preview } = values;
    const cutPreview = preview.slice(0, 200);
    const getTopicNames = topics.map((val) => val.name);
    const topicsSplit = topicInput.trim().split(/,+/).filter(Boolean);
    const topicsMap = topicsSplit.map((val) => val.trim());
    const topicNames = [...getTopicNames, ...topicsMap];
    const idDraft = newDraft?.draftId;
    const data = {
      topicNames,
      preview: cutPreview,
      banner: image.filename,
    };
    async function fetchAddBlog() {
      if (!token) return;
      const response = await apiAddBlog(idDraft, data);
      if (response?.success) {
        navigate("/");
      }
    }
    fetchAddBlog();
  };
  const handleClickPublish = () => {
    handleSubmit(handleAddBlog)();
  };

  const watchedTitle = useWatch({ control, name: "title", defaultValue: "" });
  const createDraft = async () => {
    const res = await apiCreateDarft(watchedTitle, content);
    if (res?.success) {
      setNewDraft(res);
      setIsSaved(true);
      setHasRunOnce(true);
    }
  };
  const UpdateDraft = debounce(async () => {
    const idDraft = newDraft?.draftId;
    const res = await apiUpdateDarft(idDraft, watchedTitle, content);
    if (res?.success) {
      setIsSaved(true);
    }
  }, 1000);

  useEffect(() => {
    // console.log("title",watchedTitle);
    // console.log("content",content);
    const check = content !== "" && watchedTitle !== "";
    setIsSaved(false);
    const encoder = new TextEncoder();
    const byteSize = encoder.encode(content).length;
    if (byteSize >= 30000) {
      return;
    }
    if (check && !hasRunOnce) {
      setShowIsSaved(true);
      createDraft();
    }
    if (newDraft?.draftId) {
      UpdateDraft();
    }
    // console.log("newDraft",newDraft);
    // console.log("changeDraft",changeDraft);
  }, [watchedTitle, content]);

  if (!token) return null;
  return (
    <WritePageStyle>
      <form onSubmit={handleSubmit(handleAddBlog)} autoComplete="off">
        <WriteHeader
          topicInput={topicInput}
          setTopicInput={setTopicInput}
          showIsSaved={showIsSaved}
          isSaved={isSaved}
          image={image?.url}
          handleSelectImage={handleSelectImage}
          topics={topics}
          setTopics={setTopics}
          token={token}
          isSubmitting={isSubmitting}
          handleDeleteImage={handleDeleteImage}
          handleClickPublish={handleClickPublish}
        ></WriteHeader>
        <InputHook
          className=""
          control={control}
          name="title"
          placeholder="Add title"
        ></InputHook>
        <MyEditor content={content} setContent={setContent}></MyEditor>
      </form>
    </WritePageStyle>
  );
};

export default WritePage;
