import { Fragment, useState } from "react";
import Input from "./Input";
import { icons } from "../../utils/constants";

// eslint-disable-next-line react/prop-types
const InputPasswordToggle = ({ control, name = "password" }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  if (!control) return null;
  return (
    <Fragment>
      <Input
        type={togglePassword ? "text" : "password"}
        name={name}
        placeholder="Enter your password"
        control={control}
      >
        {!togglePassword ? (
          <button
            className="flex items-center justify-center"
            onClick={() => setTogglePassword(true)}
          >
            {icons.iconEyeRemove}
          </button>
        ) : (
          <button
            className="flex items-center justify-center"
            onClick={() => setTogglePassword(false)}
          >
            {icons.iconEyeOpen}
          </button>
        )}
      </Input>
    </Fragment>
  );
};

export default InputPasswordToggle;
