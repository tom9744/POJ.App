import React, { useCallback, useMemo, useReducer } from "react";
import useHttp from "../../../hooks/useHttp";
import { JourneyDTO, RawJourney } from "../Journey.interface";
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import CustomInput from "../Layouts/CustomInput/CustomInput";
import { isNotEmpty, isValidDate } from "../ValidationService";
import classes from "./JourneyForm.module.scss";

type JourneyFormProps = {
  isActive: boolean;
  onCloseForm: () => void;
  onContentAdded: (journey: RawJourney) => void;
};

type FormAction =
  | { type: "CHANGE_TITLE"; props: { value: string; isValid: boolean } }
  | { type: "CHANGE_DESC"; props: { value: string; isValid: boolean } }
  | { type: "CHANGE_START_DATE"; props: { value: string; isValid: boolean } }
  | { type: "CHANGE_END_DATE"; props: { value: string; isValid: boolean } }
  | { type: "RESET_VALUES" };

interface FormState {
  isFormValid: boolean;
  title: string;
  isTitleValid: boolean;
  description: string;
  isDescriptionValid: boolean;
  startDate: string;
  isStartDateValid: boolean;
  endDate: string;
  isEndDateValid: boolean;
}

const INITIAL_STATE: FormState = {
  isFormValid: false,
  title: "",
  isTitleValid: false,
  description: "",
  isDescriptionValid: false,
  startDate: "",
  isStartDateValid: false,
  endDate: "",
  isEndDateValid: false,
};

const checkFormValidity = (formState: FormState): boolean => {
  return [
    formState.isTitleValid,
    formState.isDescriptionValid,
    formState.isStartDateValid,
    formState.isEndDateValid,
  ].every((isValid) => !!isValid);
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  const nextState: FormState = { ...state };

  switch (action.type) {
    case "RESET_VALUES":
      return INITIAL_STATE;
    case "CHANGE_TITLE":
      nextState.title = action.props.value;
      nextState.isTitleValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    case "CHANGE_DESC":
      nextState.description = action.props.value;
      nextState.isDescriptionValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    case "CHANGE_START_DATE":
      nextState.startDate = action.props.value;
      nextState.isStartDateValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    case "CHANGE_END_DATE":
      nextState.endDate = action.props.value;
      nextState.isEndDateValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };

    default:
      throw new Error("[JourneyForm] Invalid action type has been dispatched.");
  }
};

function JourneyForm({
  isActive,
  onCloseForm,
  onContentAdded,
}: JourneyFormProps) {
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

  const resetValues = useCallback((): void => {
    dispatch({ type: "RESET_VALUES" });
  }, []);

  const closeForm = useCallback((): void => {
    resetValues();
    onCloseForm();
  }, [resetValues, onCloseForm]);

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
          const createdJourney = await createJourney({
            url: "http://localhost:3030/journeys",
            options: {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newJourney),
            },
          });

          onContentAdded({ ...createdJourney, photos: [] });
          closeForm();
        } catch (error) {
          console.error(error);
        }
      }
    },
    [formState, closeForm, createJourney, onContentAdded]
  );

  return (
    <div
      className={`${classes["form-wrapper"]} ${
        isActive ? classes.open : classes.close
      }`}
    >
      <ExplorerHeader backward={true} onBackward={closeForm}></ExplorerHeader>

      {isActive && (
        <article className={classes["form-content"]}>
          <section className={classes["form-content-section"]}>
            <h3 className={classes.title}>기록 남기기</h3>
            <span className={classes.description}>
              새로운 기록에 대한 정보를 입력해주세요
            </span>
          </section>

          <div className={classes.divider}></div>

          <section className={classes["form-content-section"]}>
            <form className={classes.form} onSubmit={submitHandler}>
              <CustomInput
                id="journeyTitle"
                type="text"
                label="기록명"
                validators={textValidator}
                onChange={changeTitle}
              />

              <CustomInput
                id="journeyDescription"
                type="text"
                label="간단한 설명을 남겨주세요."
                validators={textValidator}
                onChange={changeDesc}
              />

              <CustomInput
                id="journeyStartDate"
                type="date"
                label="시작일"
                validators={dateValidator}
                onChange={changeStartDate}
              />

              <CustomInput
                id="journeyEndDate"
                type="date"
                label="종료일"
                validators={dateValidator}
                onChange={changeEndDate}
              />

              <button
                disabled={requestState.showLoading || !formState.isFormValid}
              >
                기록 남기기
              </button>
            </form>
          </section>
        </article>
      )}
    </div>
  );
}

export default JourneyForm;
