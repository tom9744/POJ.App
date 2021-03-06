import React, { useCallback, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../../hooks/useHttp";
import CustomInput from "../../../components/JourneyExplorer/Layouts/CustomInput/CustomInput";
import { JourneyDTO, RawJourney } from "../../../components/JourneyExplorer/Journey.interface";
import { formReducer, INITIAL_STATE } from "./JourneyForm.reducer";
import { isNotEmpty, isValidDate } from "../../../utils/FormVaildations";
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

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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

          navigateBack();
        } catch (error) {
          console.error(error);
        }
      }
    },
    [formState, createJourney, navigateBack]
  );

  return (
    <div className={classes["form-container"]}>
      <section className={classes.header}>
        <button className={classes["backward-button"]} onClick={navigateBack}>
          ??????
        </button>
      </section>

      <section className={classes["form-content-section"]}>
        <h3 className={classes.title}>?????? ??????</h3>
        <p className={classes.description}>????????? ????????? ???????????????.</p>
        <p className={classes.description}>????????? ????????? ???????????? ?????? ????????? ????????????.</p>
      </section>

      <div className={classes.divider}></div>

      <section className={classes["form-content-section"]}>
        <form className={classes.form} onSubmit={submitHandler}>
          <CustomInput id="journeyTitle" type="text" label="?????????" validators={textValidator} onChange={changeTitle} />

          <CustomInput id="journeyDescription" type="text" label="????????? ????????? ???????????????." validators={textValidator} onChange={changeDesc} />

          <CustomInput id="journeyStartDate" type="date" label="?????????" validators={dateValidator} onChange={changeStartDate} />

          <CustomInput id="journeyEndDate" type="date" label="?????????" validators={dateValidator} onChange={changeEndDate} />

          <button disabled={requestState.showLoading || !formState.isFormValid}>?????? ??????</button>
        </form>
      </section>
    </div>
  );
}

export default JourneyForm;
