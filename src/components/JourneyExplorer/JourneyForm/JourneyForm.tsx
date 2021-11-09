import React, { useState } from "react";
import { JourneyDTO, RawJourney } from "../constants/journey-data";
import ExplorerHeader from "../ExplorerHeader/ExplorerHeader";
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

function JourneyForm({
  isActive,
  onCloseForm,
  onContentAdded,
}: JourneyFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const changeTitle = (event: React.ChangeEvent): void => {
    const { value } = event.target as HTMLInputElement;

    setTitle(value);
  };

  const changeDescription = (event: React.ChangeEvent): void => {
    const { value } = event.target as HTMLInputElement;

    setDescription(value);
  };

  const changeStartDate = (event: React.ChangeEvent): void => {
    const { value } = event.target as HTMLInputElement;

    setStartDate(value);
  };

  const changeEndDate = (event: React.ChangeEvent): void => {
    const { value } = event.target as HTMLInputElement;

    setEndDate(value);
  };

  const validate = (): boolean => {
    const isNotEmpty = [title, description, startDate, endDate]
      .map((value) => value.trim().length > 0)
      .every((result) => !!result);
    const isValidDate =
      new Date(startDate).getTime() - new Date(endDate).getTime() <= 0;

    return isNotEmpty && isValidDate;
  };

  const resetValues = (): void => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  const submitHandler = (event: React.FormEvent): void => {
    event.preventDefault();

    if (validate()) {
      const newJourney: JourneyDTO = {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      createJourney(newJourney)
        .then((journey) => {
          onContentAdded(journey);
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
              value={title}
              onChange={changeTitle}
            />

            <label htmlFor="description">간단한 설명을 남겨주세요.</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={changeDescription}
            />

            <label htmlFor="startDate">시작일</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={changeStartDate}
            />

            <label htmlFor="endDate">종료일</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
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
