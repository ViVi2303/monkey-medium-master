/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from "react";
import { useController } from "react-hook-form";

const InputHook = ({ control, className, ...props }) => {
  const { field } = useController({
    control,
    name: props.name,
    defaultValue: "",
  });
  return (
    <div>
      <input
        className={`w-full py-2 text-base transition-all bg-white border-b border-gray-300 outline-none focus:border-blue-500 placeholder:text-base ${className}`}
        {...field}
        {...props}
      />
    </div>
  );
};

export default InputHook;
