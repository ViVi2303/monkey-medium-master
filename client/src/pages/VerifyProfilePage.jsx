import styled from "styled-components";
import { Image } from "antd";
import { Button } from "../components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputHook from "../components/input/InputHook";
import logo from "../assets/logo.png";
import ImageUpload from "../components/image/ImageUpload";
import { apiVerifyProfile } from "../api/apisHung";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const schema = yup.object({
  fullName: yup.string().required("Please fill out your title").min(4),
});

const VerifyProfilePageStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const VerifyProfilePage = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [image, setImage] = useState("");

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert("Choose inly .jpeg .jpg .png .gif");
      e.target.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    setValue("avatar", file);
    setImage(url);
  };

  const handleDeleteImage = () => {
    setImage("");
  };

  const handleSubmitProfile = async (values) => {
    if (!isValid) return;
    if (!values.avatar) {
      toast.error("Please fill out your avatar!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
    const formData = new FormData();

    // Append data to the FormData object
    formData.append("fullname", values.fullName);
    formData.append("avatar", values.avatar);
    try {
      const response = await apiVerifyProfile(token, formData);
      if (response.success) {
        window.location.replace(`/?token=${token}`);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  if (!token) return;

  return (
    <VerifyProfilePageStyle>
      <div className="flex items-center justify-center gap-4 mt-5 logo">
        <Image width={40} preview={false} src={logo} />
        <h1 className="font-serif font-semibold text-3xl bg-gradient-to-r from-[#74B9FF] to-[#0be881] text-transparent bg-clip-text inline-block">
          Monkey Medium
        </h1>
      </div>
      <h2 className="mt-20 font-serif text-4xl text-center">All most there!</h2>
      <p className="mt-5 text-lg text-center">
        Finish creating your account for the full Monkey Medium experience.
      </p>

      <form onSubmit={handleSubmit(handleSubmitProfile)} autoComplete="off">
        <div className="flex items-center justify-center my-10">
          <div className="w-[250px]">
            <ImageUpload
              className=""
              image={image}
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
            ></ImageUpload>
            <InputHook
              className="mt-5"
              control={control}
              name="fullName"
              placeholder="Full name"
            ></InputHook>
            <p className="text-red-500">{errors?.fullName?.message}</p>
            <div className="flex justify-center mt-10">
              <Button
                type="submit"
                className="!h-10 w-52 !z-10"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </VerifyProfilePageStyle>
  );
};

export default VerifyProfilePage;
