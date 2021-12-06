import React, { useState } from "react";

const useInput = (validator: (value: string) => boolean) => {
  const [value, setValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validator(value);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.value) {
      setValue(event.target.value);
    }
  };

  const blurHandler = () => {
    setIsTouched(true);
  };

  return {
    value,
    isTouched,
    isValid,
    changeHandler,
    blurHandler,
  };
};

export default useInput;
