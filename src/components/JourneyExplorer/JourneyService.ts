import {
  RawJourney,
  ProcessedJourney,
  RawPhoto,
  ElapsedDate,
} from "./Journey.interface";

const calculateElapsedDate = (originDate: string): ElapsedDate => {
  const originTime = new Date(originDate).getTime();
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - originTime;

  const elapsedMinutes = elapsedTime / (1000 * 60);
  const elapsedHours = elapsedMinutes / 60;
  const elapsedDays = elapsedHours / 24;

  return new ElapsedDate(
    Math.floor(elapsedMinutes),
    Math.floor(elapsedHours),
    Math.floor(elapsedDays)
  );
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

export const processJourneys = (journeys: RawJourney[]): ProcessedJourney[] => {
  if (!journeys?.length) {
    return [];
  }

  const processedJourneys = journeys.map((journey): ProcessedJourney => {
    const modifiedPhotos = modifyImagePath(journey.photos);
    const modifiedStartDate = modifyDateString(journey.startDate);
    const modifiedEndDate = modifyDateString(journey.endDate);
    const elapsedDate = calculateElapsedDate(journey.startDate);

    return {
      ...journey,
      photos: modifyImagePath(journey.photos),
      startDate: modifiedStartDate,
      endDate: modifiedEndDate,
      elapsedDate,
      thumbNailPath: modifiedPhotos.length > 0 ? modifiedPhotos[0].path : ``,
    };
  });

  return processedJourneys;
};
