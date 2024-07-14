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
import { useAuth } from "../../contexts/auth-context";
import { config } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiAddTopic } from "../../api/api";

const schema = yup.object({
  name: yup.string().required("Please fill out your name topic"),
});

const TopicAddNew = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const arrBug = Object.values(errors);
    if (arrBug.length > 0) {
      toast.error(arrBug[0]?.message, {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }, [errors]);

  const handleAddTopic = ({ name }) => {
    if (!isValid) return;
    async function fetchAddTopic() {
      if (!token) return;
      const nameTopic = name.charAt(0).toUpperCase() + name.slice(1);
      const response = await apiAddTopic(token, nameTopic);
      if (response) reset();
    }
    fetchAddTopic();
  };

  return (
    <div>
      <DashboardHeading
        title="New topic"
        desc="Add new topic"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddTopic)} autoComplete="off">
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
          Add new topic
        </Button>
      </form>
    </div>
  );
};

export default TopicAddNew;
