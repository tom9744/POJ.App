import React, { useReducer } from "react";
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
  | { type: "CHANGE_TITLE"; title: string }
  | { type: "CHANGE_DESC"; description: string }
  | { type: "CHANGE_START_DATE"; startDate: string }
  | { type: "CHANGE_END_DATE"; endDate: string }
  | { type: "RESET_VALUES" };

interface FormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "CHANGE_TITLE":
      return { ...state, title: action.title };
    case "CHANGE_DESC":
      return { ...state, description: action.description };
    case "CHANGE_START_DATE":
      return { ...state, startDate: action.startDate };
    case "CHANGE_END_DATE":
      return { ...state, endDate: action.endDate };
    case "RESET_VALUES":
      return { title: "", description: "", startDate: "", endDate: "" };
    default:
      throw new Error("[JourneyForm] Invalid action type has been dispatched.");
  }
};

function JourneyForm({
  isActive,
  onCloseForm,
  onContentAdded,
}: JourneyFormProps) {
  const [formState, dispatch] = useReducer(formReducer, {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const { requestState, sendRequest: createJourney } = useHttp<RawJourney>();

  const validate = (): boolean => {
    const { title, description, startDate, endDate } = formState;

    const isNotEmpty = [title, description, startDate, endDate]
      .map((value) => value.trim().length > 0)
      .every((result) => !!result);
    const isValidDate =
      new Date(startDate).getTime() - new Date(endDate).getTime() <= 0;

    return isNotEmpty && isValidDate;
  };

  const changeTitle = (value: string) => {
    dispatch({ type: "CHANGE_TITLE", title: value });
  };

  const changeDesc = (value: string) => {
    dispatch({ type: "CHANGE_DESC", description: value });
  };

  const changeStartDate = (value: string) => {
    dispatch({ type: "CHANGE_START_DATE", startDate: value });
  };

  const changeEndDate = (value: string) => {
    dispatch({ type: "CHANGE_END_DATE", endDate: value });
  };

  const resetValues = (): void => {
    dispatch({ type: "RESET_VALUES" });
  };

  const closeForm = (): void => {
    resetValues();
    onCloseForm();
  };

  const submitHandler = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (validate()) {
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
  };

  return (
    <div
      className={`${classes["form-wrapper"]} ${
        isActive ? classes.open : classes.close
      }`}
    >
      <ExplorerHeader backward={true} onBackward={closeForm}></ExplorerHeader>

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
              validators={[isNotEmpty]}
              onChange={changeTitle}
            />

            <CustomInput
              id="journeyDescription"
              type="text"
              label="간단한 설명을 남겨주세요."
              validators={[isNotEmpty]}
              onChange={changeDesc}
            />

            <CustomInput
              id="journeyStartDate"
              type="date"
              label="시작일"
              validators={[isNotEmpty, isValidDate]}
              onChange={changeStartDate}
            />

            <CustomInput
              id="journeyEndDate"
              type="date"
              label="종료일"
              validators={[isNotEmpty, isValidDate]}
              onChange={changeEndDate}
            />

            <button disabled={requestState.showLoading}>기록 남기기</button>
          </form>
        </section>
      </article>
    </div>
  );
}

export default JourneyForm;
