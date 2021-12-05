import React, { useReducer } from "react";
import { JourneyDTO, RawJourney } from "../Journey.interface";
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import classes from "./JourneyForm.module.scss";

type JourneyFormProps = {
  isActive: boolean;
  onCloseForm: () => void;
  onContentAdded: (journey: RawJourney) => void;
};

const createJourney = async (journey: JourneyDTO): Promise<RawJourney> => {
  const response = await fetch("http://localhost:3030/journeys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journey),
  });
  const body: RawJourney = await response.json();

  // [Note] Responses with a code either 40X or 50X is not an error.
  if (!response.ok) {
    throw body;
  }

  return body;
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
      return { ...state, title: action.description };
    case "CHANGE_START_DATE":
      return { ...state, title: action.startDate };
    case "CHANGE_END_DATE":
      return { ...state, title: action.endDate };
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

  const changeTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_TITLE", title: target.value });
  };

  const changeDesc = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_DESC", description: target.value });
  };

  const changeStartDate = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_START_DATE", startDate: target.value });
  };

  const changeEndDate = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_END_DATE", endDate: target.value });
  };

  const resetValues = (): void => {
    dispatch({ type: "RESET_VALUES" });
  };

  const validate = (): boolean => {
    const { title, description, startDate, endDate } = formState;

    const isNotEmpty = [title, description, startDate, endDate]
      .map((value) => value.trim().length > 0)
      .every((result) => !!result);
    const isValidDate =
      new Date(startDate).getTime() - new Date(endDate).getTime() <= 0;

    return isNotEmpty && isValidDate;
  };

  const submitHandler = (event: React.FormEvent): void => {
    event.preventDefault();

    if (validate()) {
      const { title, description, startDate, endDate } = formState;
      const newJourney: JourneyDTO = {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      createJourney(newJourney)
        .then((journey) => {
          onContentAdded({ ...journey, photos: [] });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          closeHandler();
        });
    }
  };

  const closeHandler = (): void => {
    resetValues();

    onCloseForm();
  };

  return (
    <div
      className={`${classes["form-wrapper"]} ${
        isActive ? classes.open : classes.close
      }`}
    >
      <ExplorerHeader
        backward={true}
        onBackward={closeHandler}
      ></ExplorerHeader>

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
            <label htmlFor="newTitle">기록명</label>
            <input
              type="text"
              id="newTitle"
              value={formState.title}
              onChange={changeTitle}
            />

            <label htmlFor="description">간단한 설명을 남겨주세요.</label>
            <input
              type="text"
              id="description"
              value={formState.description}
              onChange={changeDesc}
            />

            <label htmlFor="startDate">시작일</label>
            <input
              type="date"
              id="startDate"
              value={formState.startDate}
              onChange={changeStartDate}
            />

            <label htmlFor="endDate">종료일</label>
            <input
              type="date"
              id="endDate"
              value={formState.endDate}
              onChange={changeEndDate}
            />

            <button>기록 남기기</button>
          </form>
        </section>
      </article>
    </div>
  );
}

export default JourneyForm;
