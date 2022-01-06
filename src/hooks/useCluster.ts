import { useMemo } from "react";

declare const kakao: any;

const useCluster = (kakaoMap: any) => {
  const clusterer = useMemo(
    () =>
      new kakao.maps.MarkerClusterer({
        map: kakaoMap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 5, // 클러스터 할 최소 지도 레벨
      }),
    [kakaoMap]
  );

  return clusterer;
};

export default useCluster;
