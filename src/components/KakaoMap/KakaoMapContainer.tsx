import React, { useEffect, useState } from "react";
import { generateMarker, generateOverlay, MarkerData } from "./KakaoMapService";
import "./CustomOverlay.scss";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapContainerProps = { kakaoMap: any; markerDataList: MarkerData[] };

function KakaoMapContainer({
  kakaoMap,
  markerDataList,
}: KakaoMapContainerProps) {
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

  let selectedOverlay: any = null;

  useEffect(() => {
    const newOverlays = markerDataList.map((markerData) =>
      generateOverlay(markerData)
    );

    const newMarkers = markerDataList.map(({ coordinate }, index) => {
      const newMarker = generateMarker(coordinate);

      kakao.maps.event.addListener(newMarker, "click", () => {
        const targetOverlay = newOverlays[index];

        // TODO: Fix the timing issue when using 'useState'
        if (!!selectedOverlay) {
          selectedOverlay.setMap(null);
          selectedOverlay = null;
        }
        targetOverlay.setMap(kakaoMap);
        selectedOverlay = targetOverlay;
      });

      return newMarker;
    });

    setOverlays(newOverlays);
    setMarkers(newMarkers);
  }, [markerDataList]);

  useEffect(() => {
    markers.forEach((marker) => marker.setMap(kakaoMap));

    return () => {
      [...markers, ...overlays].forEach((elem) => elem.setMap(null)); // Clear all elements
    };
  }, [kakaoMap, markers, overlays]);

  return <React.Fragment></React.Fragment>;
}

export default KakaoMapContainer;
