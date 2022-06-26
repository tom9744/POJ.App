import { useCallback, useEffect, useState } from "react";
import { IJourneyData, IPhotoData } from "../../../types/apis";
import { createJourneyModel, IJoureny } from "../../../models/journey.model";
import useHttp, { BASE_URL } from "../../../hooks/useHttp";

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
        const journey = createJourneyModel(journeyData);

        setJourney(journey);
        setPhotoList(journey.photos);
      })
      .catch((error) => console.error(error));

    return () => setJourney(null);
  }, [journeyId, sendRequest, sortByElapsedDate]);

  return { requestState, journey, photoList, setPhotoList };
};
