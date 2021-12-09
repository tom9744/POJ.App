import React, { useCallback, useEffect, useState } from "react";
import { isString } from "../../../../typeGuards";

import classes from "./CustomInput.module.scss";

type CustomInputProps = {
  type: string;
  id: string;
  label: string;
  validators?: Array<(value: string) => boolean | string>;
  onChange: (value: string) => void;
};

function CustomInput({
  id,
  type,
  label,
  validators = [],
  onChange,
}: CustomInputProps) {
  const [enteredValue, setEnteredValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setHasError(!isValid && isTouched);
  }, [isValid, isTouched]);

  useEffect(() => {
    const results = validators.map((validator) => validator(enteredValue));
    const errorMessage = results.find(isString); // NOTE: Using User-Defined Type Guards for Type-Casting

    if (errorMessage) {
      setErrorMessage(errorMessage);
      setIsValid(false);
    } else {
      setErrorMessage("");
      setIsValid(true);
    }
  }, [enteredValue, validators]);

  const blurHandler = useCallback(() => {
    setIsTouched(true);
  }, []);

  const changeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setEnteredValue(value);

      onChange(value);
    },
    [onChange]
  );

  return (
    <div className={`text-input ${classes["text-input-wrapper"]}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={enteredValue}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      <small>{hasError && errorMessage}</small>
    </div>
  );
}

export default CustomInput;
