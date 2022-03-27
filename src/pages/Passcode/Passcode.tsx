import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMobileAppDispatch } from "../../MobileAppProvider";
import CustomInput from "../../components/JourneyExplorer/Layouts/CustomInput/CustomInput";
import SquareButton from "../../components/UI/SquareButton/SquareButton";
import classes from "./Passcode.module.scss";

const 기념일 = "2020-01-18";

export default function PassCode() {
  const [passcode, setPasscode] = useState("");
  const dispatch = useMobileAppDispatch();
  const navigate = useNavigate();

  const changeHandler = useCallback((value: string): void => {
    setPasscode(value);
  }, []);

  const submitHandler = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();

      if (passcode !== 기념일) {
        return;
      }

      dispatch({ name: "AUTHORIZE_USER" });
      navigate("/", { replace: true });
    },
    [passcode, dispatch]
  );

  return (
    <article className={classes.PasscodeContainer}>
      <span className={classes.Message}>기념일을 입력해주세요.</span>

      <form className={classes.InputWrapper} onSubmit={submitHandler}>
        <CustomInput type="date" id="passcode" size="small" onChange={changeHandler}></CustomInput>

        <SquareButton text="확인" size="small"></SquareButton>
      </form>
    </article>
  );
}
