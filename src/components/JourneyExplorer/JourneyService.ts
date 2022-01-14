import { RawJourney, ProcessedJourney, RawPhoto, ElapsedDate, ProcessedPhoto } from "./Journey.interface";

const calculateElapsedDate = (originDate: string): ElapsedDate => {
  const originTime = new Date(originDate).getTime();
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - originTime;

  const elapsedMinutes = elapsedTime / (1000 * 60);
  const elapsedHours = elapsedMinutes / 60;
  const elapsedDays = elapsedHours / 24;

  return new ElapsedDate(elapsedTime, Math.floor(elapsedMinutes), Math.floor(elapsedHours), Math.floor(elapsedDays));
};

const modifyDateString = (date: string): string => {
  return date.substring(0, 10).replace(/-/g, ".");
};

const processPhoto = (photo: RawPhoto): ProcessedPhoto => {
  if (!photo) {
    throw new Error("[JourneyService] Something went wrong while processing photo data");
  }

  return {
    ...photo,
    modifyDate: modifyDateString(photo.modifyDate),
    elapsedDate: calculateElapsedDate(photo.modifyDate),
  };
};

export const processPhotos = (photos: RawPhoto[]): ProcessedPhoto[] => {
  if (!photos?.length) {
    return [];
  }

  return photos.map((photo) => processPhoto(photo));
};

export const sortPhotosByElapsedTime = (processedPhotos: ProcessedPhoto[]): ProcessedPhoto[] => {
  return processedPhotos.sort((photoA, photoB) => photoB.elapsedDate.elapsedTime - photoA.elapsedDate.elapsedTime);
};

export const processJourney = (journey: RawJourney): ProcessedJourney => {
  if (!journey) {
    throw new Error("[JourneyService] Something went wrong while processing joureny data");
  }

  return {
    ...journey,
    photos: sortPhotosByElapsedTime(processPhotos(journey.photos)),
    startDate: modifyDateString(journey.startDate),
    endDate: modifyDateString(journey.endDate),
    elapsedDate: calculateElapsedDate(journey.startDate),
  };
};

export const processJourneys = (journeys: RawJourney[]): ProcessedJourney[] => {
  if (!journeys?.length) {
    return [];
  }

  return journeys.map((journey) => processJourney(journey));
};

export const sortJourneysByElapsedTime = (ProcessedJourneys: ProcessedJourney[]): ProcessedJourney[] => {
  return ProcessedJourneys.sort(
    (journeyA, journeyB) => journeyA.elapsedDate.elapsedTime - journeyB.elapsedDate.elapsedTime
  );
};
