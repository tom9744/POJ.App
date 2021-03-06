import React, { useEffect, useState } from "react";
import { generateMarker, MarkerData } from "./KakaoMapService";
import "./CustomOverlay.scss";
import useCluster from "../../hooks/useCluster";
import useOverlay from "../../hooks/useOverlay";
import usePolyline, { PolylineOption } from "../../hooks/usePolyline";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapContainerProps = { kakaoMap: any; markerDataList: MarkerData[] };

const POLYLINE_OPTION: PolylineOption = {
  strokeWeight: 3.5,
  strokeColor: "#FFAE00",
  strokeOpacity: 0.8,
  strokeStyle: "solid",
};

function KakaoMapContainer({ kakaoMap, markerDataList }: KakaoMapContainerProps) {
  const [markers, setMarkers] = useState<any[]>([]);

  const clusterer = useCluster(kakaoMap);
  const { selectedOverlay, setSelectedOverlay, generateOverlays } = useOverlay(kakaoMap);
  const { polylines, generatePolylines } = usePolyline(POLYLINE_OPTION);

  useEffect(() => {
    generatePolylines(markerDataList);
  }, [markerDataList, generatePolylines]);

  useEffect(() => {
    setSelectedOverlay(null);
  }, [markerDataList, setSelectedOverlay]);

  useEffect(() => {
    const overlays = generateOverlays(markerDataList);
    const markers = markerDataList.map((markerData, index) => {
      const marker = generateMarker(markerData);

      kakao.maps.event.addListener(marker, "click", () => {
        setSelectedOverlay(!!selectedOverlay ? null : overlays[index]);
      });

      return marker;
    });

    setMarkers(markers);
  }, [markerDataList, selectedOverlay, setSelectedOverlay, generateOverlays]);

  useEffect(() => {
    [...markers, ...polylines].forEach((marker) => marker.setMap(kakaoMap));
    clusterer.addMarkers(markers);
    return () => {
      // NOTE: Clear all elements
      [...markers, ...polylines].forEach((elem) => elem.setMap(null));
      clusterer.removeMarkers(markers);
    };
  }, [kakaoMap, clusterer, markers, polylines]);

  useEffect(
    () => () => {
      markers?.forEach((elem) => elem.setMap(null));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <React.Fragment></React.Fragment>;
}

export default React.memo(KakaoMapContainer);
