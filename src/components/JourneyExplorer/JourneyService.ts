import { RawJourney, ProcessedJourney, RawPhoto } from "./Journey.interface";

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

  const processedJourneys = journeys
    .map((journey): RawJourney => {
      return {
        ...journey,
        photos: modifyImagePath(journey.photos),
        startDate: modifyDateString(journey.startDate),
        endDate: modifyDateString(journey.endDate),
      };
    })
    .map((journey): ProcessedJourney => {
      return {
        ...journey,
        thumbNailPath: journey.photos?.length > 0 ? journey.photos[0].path : ``,
      };
    });

  return processedJourneys;
};
