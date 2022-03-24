import { useMemo } from "react";

export interface IElapsedDate {
  elapsedTime: number;
  toString(): string;
}

class ElapsedDate implements IElapsedDate {
  private _elapsedTime: number;

  constructor(originDate: string) {
    const originTime = new Date(originDate).getTime();
    const currentTime = new Date().getTime();

    this._elapsedTime = currentTime - originTime;
  }

  get elapsedTime(): number {
    return this._elapsedTime;
  }

  toString(): string {
    const elapsedMinutes = Math.floor(this._elapsedTime / (1000 * 60));
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedDays > 0) {
      return `${elapsedDays}일 전`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours}시간 전`;
    } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes}분 전`;
    } else {
      return "방금 전";
    }
  }
}

const useElapsedDate = (originDate: string): IElapsedDate => {
  const elapsedDate = useMemo(() => new ElapsedDate(originDate), [originDate]);

  return elapsedDate;
};

export default useElapsedDate;
