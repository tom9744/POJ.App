import { useCallback, useEffect, useState } from "react";
import { IJourneyData, IPhotoData } from "../../../types/apis";
import { createJourneyModel, IJoureny } from "../../../models/journey.model";
import useHttp, { BASE_URL } from "../../../hooks/useHttp";

export const useJourneyList = () => {
  const [journeyList, setJourneyList] = useState<IJoureny[]>([]);
  const { requestState, sendRequest } = useHttp<IJourneyData[]>();

  const sortByElapsedDate = useCallback((itemA: IJoureny, itemB: IJoureny) => {
    return itemA.elapsedDate.elapsedTime - itemB.elapsedDate.elapsedTime;
  }, []);

  useEffect(() => {
    sendRequest({ url: `${BASE_URL}/journeys` })
      .then((jourenyDataList) => {
        const journeyList = jourenyDataList.map((joureny) => createJourneyModel(joureny)).sort(sortByElapsedDate);

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
        const journey = createJourneyModel(journeyData);

        setJourney(journey);
        setPhotoList(journey.photos);
      })
      .catch((error) => console.error(error));

    return () => setJourney(null);
  }, [journeyId, sendRequest, sortByElapsedDate]);

  return { requestState, journey, photoList, setPhotoList };
};
