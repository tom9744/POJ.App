import { IJourneyData, IPhotoData } from "../types/apis";

interface IElapsedDate {
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

export interface IJoureny {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  elapsedDate: IElapsedDate;
  photos: IPhotoData[];
}

class Journey implements IJoureny {
  private _id: number;
  get id(): number {
    return this._id;
  }

  private _title: string;
  get title(): string {
    return this._title;
  }

  private _description: string;
  get description(): string {
    return this._description;
  }

  private _startDate: string;
  get startDate(): string {
    return this.prettifyDate(this._startDate);
  }

  private _endDate: string;
  get endDate(): string {
    return this.prettifyDate(this._endDate);
  }

  private _elapsedDate: IElapsedDate;
  get elapsedDate(): IElapsedDate {
    return this._elapsedDate;
  }

  private _photos: IPhotoData[];
  get photos(): IPhotoData[] {
    return [...this._photos];
  }

  constructor(args: IJourneyData) {
    this._id = args.id;
    this._title = args.title;
    this._description = args.description;
    this._startDate = args.startDate;
    this._endDate = args.endDate;
    this._elapsedDate = new ElapsedDate(args.startDate);
    this._photos = args.photos;
  }

  private prettifyDate = (date: string): string => {
    return date.substring(0, 10).replace(/-/g, ".");
  };
}

export function createJourneyModel(args: IJourneyData) {
  return new Journey(args);
}
