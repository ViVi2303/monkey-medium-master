import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { NavLink, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "../components/label";
import { Field } from "../components/field";
import { toast } from "react-toastify";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import { apiChangeForgotPassword } from "../api/apisHung";
import { Image } from "antd";
import logo from "../assets/logo.png";

const schema = yup.object({
  confirmPassword: yup
    .string()
    .min(8, "Your confirm password must be at least 8 characters or greater")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
});

const ForgotPasswordPage = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleChangePass = async (values) => {
    if (!isValid) return;
    const { confirmPassword, password } = values;
    if (confirmPassword !== password) {
      toast.error("Confirm password is not correct", {
        pauseOnHover: false,
        delay: 0,
      });
      return;
    }
    try {
      const response = await apiChangeForgotPassword(
        token,
        password,
        confirmPassword
      );
      if (response.success) {
        toast.success(response.message, {
          pauseOnHover: false,
          delay: 200,
        });
        reset();
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  if (!token) return;

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 my-10 logo">
        <Image width={40} preview={false} src={logo} />
        <h1 className="font-bold text-4xl bg-gradient-to-r from-[#74B9FF] to-[#0be881] text-transparent bg-clip-text inline-block">
          Monkey Medium
        </h1>
      </div>
      <h2 className="flex items-center justify-center mb-10 text-2xl font-bold text-gray-400">
        Set Your Password
      </h2>
      <form
        className="w-full max-w-lg mx-auto"
        onSubmit={handleSubmit(handleChangePass)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="password">New Password</Label>
          <InputPasswordToggle
            name="password"
            placeholder="Enter your password"
            control={control}
          />
          <p className="text-red-500">{errors?.password?.message}</p>
        </Field>
        <Field>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <InputPasswordToggle
            name="confirmPassword"
            placeholder="Confirm password"
            control={control}
          />
          <p className="text-red-500">{errors?.confirmPassword?.message}</p>
        </Field>

        <div className="have-account">
          Head back to <NavLink to={"/sign-in"}>Login</NavLink>{" "}
        </div>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Button
            type="submit"
            className="w-full max-w-[300px] mx-auto"
            width="150px"
            height="45px"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Change password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
