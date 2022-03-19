import React, { useCallback, useEffect, useState } from "react";
import { isString } from "../../../../typeGuards";

import classes from "./CustomInput.module.scss";

type CustomInputProps = {
  type: string;
  id: string;
  size?: "small" | "medium" | "large";
  label?: string;
  autoComplete?: boolean;
  autoFocus?: boolean;
  validators?: Array<(value: string) => boolean | string>;
  onChange: (value: string, isValid: boolean) => void;
};

function CustomInput({
  type,
  id,
  size = "medium",
  label = "",
  autoComplete = false,
  autoFocus = false,
  validators = [],
  onChange,
}: CustomInputProps) {
  const [enteredValue, setEnteredValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(!isValid && isTouched);
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
    <div className={`${classes["text-input-wrapper"]} ${classes[size]}`}>
      {label ? <label htmlFor={id}>{label}</label> : null}

      <input
        type={type}
        id={id}
        value={enteredValue}
        autoComplete={autoComplete ? "on" : "off"}
        autoFocus={autoFocus}
        onChange={changeHandler}
        onBlur={blurHandler}
      />

      <small className={classes["error-message"]}>
        {showMessage && errorMessage}
      </small>
    </div>
  );
}

export default React.memo(CustomInput);
