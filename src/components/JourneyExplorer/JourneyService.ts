import { RawJourney, ProcessedJourney, RawPhoto, ElapsedDate } from "./Journey.interface";

const calculateElapsedDate = (originDate: string): ElapsedDate => {
  const originTime = new Date(originDate).getTime();
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - originTime;

  const elapsedMinutes = elapsedTime / (1000 * 60);
  const elapsedHours = elapsedMinutes / 60;
  const elapsedDays = elapsedHours / 24;

  return new ElapsedDate(Math.floor(elapsedMinutes), Math.floor(elapsedHours), Math.floor(elapsedDays));
};

const modifyDateString = (date: string): string => {
  return date.substring(0, 10).replace(/-/g, ".");
};

export const modifyImagePath = (photos: RawPhoto[]): RawPhoto[] => {
  if (!photos?.length) {
    return [];
  }

  const processedPhotos = photos.map((photo) => {
    return {
      ...photo,
      path: `http://localhost:3030/${photo.path.substring(6)}`,
    };
  });

  return processedPhotos;
};

export const processJourney = (journey: RawJourney): ProcessedJourney => {
  if (!journey) {
    throw new Error("[JourneyService] Something went wrong while processing joureny data");
  }

  const modifiedPhotos = modifyImagePath(journey.photos);

  return {
    ...journey,
    photos: modifiedPhotos,
    startDate: modifyDateString(journey.startDate),
    endDate: modifyDateString(journey.endDate),
    elapsedDate: calculateElapsedDate(journey.startDate),
    thumbNailPath: modifiedPhotos.length > 0 ? modifiedPhotos[0].path : ``,
  };
};

export const processJourneys = (journeys: RawJourney[]): ProcessedJourney[] => {
  if (!journeys?.length) {
    return [];
  }

  return journeys.map((journey) => processJourney(journey));
};
