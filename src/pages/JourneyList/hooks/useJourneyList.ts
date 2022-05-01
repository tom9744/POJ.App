import { useCallback, useEffect, useState } from "react";
import { IJourneyData, IPhotoData } from "../JourneyData.model";
import useHttp, { BASE_URL } from "../../../hooks/useHttp";

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

  constructor(arg: IJourneyData) {
    this._id = arg.id;
    this._title = arg.title;
    this._description = arg.description;
    this._startDate = arg.startDate;
    this._endDate = arg.endDate;
    this._elapsedDate = new ElapsedDate(arg.startDate);
    this._photos = arg.photos;
  }

  private prettifyDate = (date: string): string => {
    return date.substring(0, 10).replace(/-/g, ".");
  };
}

export const useJourneyList = () => {
  const [journeyList, setJourneyList] = useState<IJoureny[]>([]);
  const { requestState, sendRequest } = useHttp<IJourneyData[]>();

  const sortByElapsedDate = useCallback((itemA: IJoureny, itemB: IJoureny) => {
    return itemA.elapsedDate.elapsedTime - itemB.elapsedDate.elapsedTime;
  }, []);

  useEffect(() => {
    sendRequest({ url: `${BASE_URL}/journeys` })
      .then((jourenyDataList) => {
        const journeyList = jourenyDataList.map((joureny) => new Journey(joureny)).sort(sortByElapsedDate);

        setJourneyList(journeyList);
      })
      .catch((error) => console.error(error));

    return () => setJourneyList([]);
  }, [sendRequest, sortByElapsedDate]);

  return { requestState, journeyList, setJourneyList };
};

export const useJourney = (journeyId: number) => {
  const [journey, setJourney] = useState<IJoureny | null>(null);
  const [photoList, setPhotoList] = useState<IPhotoData[]>([]);
  const { requestState, sendRequest } = useHttp<IJourneyData>();

  const sortByElapsedDate = useCallback((itemA: IJoureny, itemB: IJoureny) => {
    return itemA.elapsedDate.elapsedTime - itemB.elapsedDate.elapsedTime;
  }, []);

  useEffect(() => {
    if (!journeyId) {
      setJourney(null);
      setPhotoList([]);
      return;
    }

    sendRequest({ url: `${BASE_URL}/journeys/${journeyId}` })
      .then((journeyData) => {
        const journey = new Journey(journeyData);

        setJourney(journey);
        setPhotoList(journey.photos);
      })
      .catch((error) => console.error(error));

    return () => setJourney(null);
  }, [journeyId, sendRequest, sortByElapsedDate]);

  return { requestState, journey, photoList, setPhotoList };
};
