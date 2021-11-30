import { RawJourney, ProcessedJourney, RawPhoto } from "./Journey.interface";

export class HttpError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

/**
 * Fetch journey data from the server.
 * @returns an entire list of journeys.
 */
export const fetchJourneys = async (): Promise<RawJourney[]> => {
  const response = await fetch("http://localhost:3030/journeys");

  if (response.ok) {
    const responseBody: RawJourney[] = await response.json();
    return responseBody;
  } else {
    const errorData = new HttpError(response.status, response.statusText);
    throw errorData;
  }
};

export const modifyImagePath = (photos: RawPhoto[]): RawPhoto[] => {
  if (!photos?.length) {
    return photos;
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
      return journey.photos?.length > 0
        ? {
            ...journey,
            photos: modifyImagePath(journey.photos),
          }
        : journey;
    })
    .map((journey): ProcessedJourney => {
      return {
        ...journey,
        thumbNailPath: journey.photos?.length > 0 ? journey.photos[0].path : ``,
      };
    });

  return processedJourneys;
};
