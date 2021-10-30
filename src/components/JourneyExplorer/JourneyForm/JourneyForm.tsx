import React, { useState } from "react";
import classes from "./JourneyForm.module.scss";

type JourneyFormProps = {
  isActive: boolean;
  onCloseForm: (event: React.MouseEvent) => void;
};

function JourneyForm({ isActive, onCloseForm }: JourneyFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const changeTitle = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;

    setTitle(value);
  };

  const changeStartDate = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;

    setStartDate(value);
  };

  const changeEndDate = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;

    setEndDate(value);
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div
      className={`${classes["form-wrapper"]} ${
        isActive ? classes.open : classes.close
      }`}
    >
      <section className={classes["form-header"]}>
        <button className={classes["back-button"]} onClick={onCloseForm}>
          이전
        </button>
      </section>

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

            {/* <label>...?</label>
            <input type="text" name="" id="" /> */}

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
