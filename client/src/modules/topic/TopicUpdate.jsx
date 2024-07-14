/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Button } from "../../components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { apiUpdateTopic } from "../../api/api";

const schema = yup.object({
  name: yup.string().required("Please fill out your name topic"),
});

const TopicUpdate = () => {
  const token = localStorage.getItem("token");
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get("name");
  const id = searchParams.get("id");

  useEffect(() => {
    if (nameParam) {
      reset({
        name: nameParam,
      });
    }
  }, [nameParam, reset]);

  useEffect(() => {
    const arrBug = Object.values(errors);
    if (arrBug.length > 0) {
      toast.error(arrBug[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  const handleUpdateTopic = async ({ name }) => {
    if (!isValid) return;
    const nameTopic = name.charAt(0).toUpperCase() + name.slice(1);
    console.log("nameTopic:", nameTopic);
    async function fetchAddTopic() {
      if (!token) return;
      await apiUpdateTopic(token, id, nameTopic);
    }
    fetchAddTopic();
  };

  return (
    <div>
      <DashboardHeading title="Update topic"></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateTopic)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your topic name"
            ></Input>
          </Field>
        </div>
        <Button type="submit" height="50px" kind="primary" className="mx-auto">
          Edit Topic
        </Button>
      </form>
    </div>
  );
};

export default TopicUpdate;
