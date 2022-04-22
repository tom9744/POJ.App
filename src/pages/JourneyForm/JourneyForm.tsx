import React, { useCallback, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import CustomInput from "../../components/JourneyExplorer/Layouts/CustomInput/CustomInput";
import { JourneyDTO, RawJourney } from "../../components/JourneyExplorer/Journey.interface";
import { formReducer, INITIAL_STATE } from "./JourneyForm.reducer";
import { isNotEmpty, isValidDate } from "../../utils/FormVaildations";
import classes from "./JourneyForm.module.scss";

function JourneyForm() {
  const navigate = useNavigate();

  const [formState, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const { requestState, sendRequest: createJourney } = useHttp<RawJourney>();

  const textValidator = useMemo(() => [isNotEmpty], []);
  const dateValidator = useMemo(() => [isNotEmpty, isValidDate], []);

  const changeTitle = useCallback((value: string, isValid: boolean) => {
    dispatch({ type: "CHANGE_TITLE", props: { value, isValid } });
  }, []);

  const changeDesc = useCallback((value: string, isValid: boolean) => {
    dispatch({ type: "CHANGE_DESC", props: { value, isValid } });
  }, []);

  const changeStartDate = useCallback((value: string, isValid: boolean) => {
    dispatch({ type: "CHANGE_START_DATE", props: { value, isValid } });
  }, []);

  const changeEndDate = useCallback((value: string, isValid: boolean) => {
    dispatch({ type: "CHANGE_END_DATE", props: { value, isValid } });
  }, []);

  const submitHandler = useCallback(
    async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();

      if (formState.isFormValid) {
        const { title, description, startDate, endDate } = formState;

        const newJourney: JourneyDTO = {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        };

        try {
          await createJourney({
            url: "https://var-resa.link/journeys",
            options: {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newJourney),
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [formState, createJourney]
  );

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={classes["form-container"]}>
      <section className={classes.header}>
        <button className={classes["backward-button"]} onClick={navigateBack}>
          취소
        </button>
      </section>

      <section className={classes["form-content-section"]}>
        <h3 className={classes.title}>기록 추가</h3>
        <p className={classes.description}>새로운 기록을 시작합니다.</p>
        <p className={classes.description}>필요한 정보를 입력하고 완료 버튼을 누르세요.</p>
      </section>

      <div className={classes.divider}></div>

      <section className={classes["form-content-section"]}>
        <form className={classes.form} onSubmit={submitHandler}>
          <CustomInput id="journeyTitle" type="text" label="기록명" validators={textValidator} onChange={changeTitle} />

          <CustomInput id="journeyDescription" type="text" label="간단한 설명을 남겨주세요." validators={textValidator} onChange={changeDesc} />

          <CustomInput id="journeyStartDate" type="date" label="시작일" validators={dateValidator} onChange={changeStartDate} />

          <CustomInput id="journeyEndDate" type="date" label="종료일" validators={dateValidator} onChange={changeEndDate} />

          <button disabled={requestState.showLoading || !formState.isFormValid}>작성 완료</button>
        </form>
      </section>
    </div>
  );
}

export default JourneyForm;
