import React, { useCallback, useEffect, useState } from "react";
import { isString } from "../../../../typeGuards";

import classes from "./CustomInput.module.scss";

type CustomInputProps = {
  type: string;
  id: string;
  label: string;
  autoComplete?: boolean;
  validators?: Array<(value: string) => boolean | string>;
  onChange: (value: string, isValid: boolean) => void;
};

function CustomInput({
  id,
  type,
  label,
  autoComplete = false,
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
    if (validators.length > 0) {
      const results = validators.map((validator) => validator(enteredValue));
      const errorMessage = results.find(isString); // NOTE: Using User-Defined Type Guards for Type-Casting

      setErrorMessage(errorMessage ?? "");
      setIsValid(!!!errorMessage);

      onChange(enteredValue, !!!errorMessage);
    } else {
      onChange(enteredValue, true);
    }
  }, [enteredValue, validators, onChange]);

  const blurHandler = useCallback(() => {
    setIsTouched(true);
  }, []);

  const changeHandler = useCallback((event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    setEnteredValue(value);
  }, []);

  return (
    <div className={`text-input ${classes["text-input-wrapper"]}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={enteredValue}
        onChange={changeHandler}
        onBlur={blurHandler}
        autoComplete={autoComplete ? "on" : "off"}
      />
      <small>{hasError && errorMessage}</small>
    </div>
  );
}

export default React.memo(CustomInput);
