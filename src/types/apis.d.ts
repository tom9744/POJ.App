export interface IPhotoData {
  id: number;
  filename: string;
  latitude: number;
  longitude: number;
  modifyDate: string;
  originalPath: string;
  thumbnailPath: string;
}

export interface IJourneyData {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  photos: IPhotoData[];
}
