export interface Journey {
  path: string;
}

export interface JourneyDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface RawJourney {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  photos: RawPhoto[];
}

export interface ProcessedJourney extends RawJourney {
  photos: ProcessedPhoto[];
  elapsedDate: ElapsedDate;
}

export interface RawPhoto {
  id: number;
  filename: string;
  latitude: number;
  longitude: number;
  modifyDate: string;
  path: string;
}

export interface ProcessedPhoto extends RawPhoto {
  elapsedDate: ElapsedDate;
}

export class ElapsedDate {
  constructor(private rawTime: number, public minutes: number, public hours: number, public days: number) {}

  public get elapsedTime(): number {
    return this.rawTime;
  }

  public generateText() {
    if (this.days > 0) {
      return `${this.days}일 전`;
    } else if (this.hours > 0) {
      return `${this.hours}시간 전`;
    } else if (this.minutes > 0) {
      return `${this.minutes}분 전`;
    } else {
      return "방금 전";
    }
  }
}
