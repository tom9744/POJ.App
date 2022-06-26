import { useCallback, useEffect, useState } from "react";
import { IJourneyData } from "../../../types/apis";
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
