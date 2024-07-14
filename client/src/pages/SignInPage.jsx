import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { icons } from "../utils/constants";
import InputAuth from "../components/input/InputAuth";
import { Label } from "../components/label";
import { Field } from "../components/field";
import { apiLogin } from "../api/apisHung";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
});

const SignInPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const handleSignIn = async (values) => {
    if (!isValid) return;
    const { email, password } = values;

    try {
      const response = await apiLogin(email, password);
      if (response.success && !response.hasProfile) {
        if (response.token) navigate(`/verify-profile?token=${response.token}`);
        return;
      }
      if (response.success && response.hasProfile) {
        window.location.replace(`/?token=${response.token}`);
        return;
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div>
      <form
        className="w-full max-w-lg mx-auto"
        onSubmit={handleSubmit(handleSignIn)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="email">Email address</Label>
          <InputAuth
            type="email"
            name="email"
            placeholder="Enter your email"
            control={control}
          />
          <p className="text-red-500">{errors?.email?.message}</p>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputAuth
            type="password"
            name="password"
            placeholder="Enter your password"
            control={control}
          />
          <p className="text-red-500">{errors?.password?.message}</p>
        </Field>
        <div className="flex justify-between have-account">
          <p>
            You do not have an account?{" "}
            <NavLink to={"/sign-up"}>Register</NavLink>{" "}
          </p>
          <p className="text-sm font-semibold">
            <NavLink to={"/send-email-password"}>I forgot password</NavLink>
          </p>
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
            Sign In
          </Button>
          <p className="text-lg font-semibold text-gray-400">or</p>
          <Button
            type="button"
            height="45px"
            to={"http://localhost:8080/api/v1/auth/google"}
          >
            {icons.googleIcon} <span className="ml-2">Login with Google</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
