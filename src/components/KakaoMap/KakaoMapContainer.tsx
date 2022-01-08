import React, { useEffect, useState } from "react";
import { generateMarker, generatePolyline, MarkerData } from "./KakaoMapService";
import "./CustomOverlay.scss";
import useCluster from "../../hooks/useCluster";
import useOverlay from "../../hooks/useOverlay";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapContainerProps = { kakaoMap: any; markerDataList: MarkerData[] };

function KakaoMapContainer({ kakaoMap, markerDataList }: KakaoMapContainerProps) {
  const [polylines, setPolylines] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);

  const clusterer = useCluster(kakaoMap);
  const { selectedOverlay, setSelectedOverlay, generateOverlays } = useOverlay(kakaoMap);

  useEffect(() => {
    const polylines: any[] = [];
    const overlays = generateOverlays(markerDataList);
    const markers: any[] = [];

    markerDataList.forEach((markerData, index, origin) => {
      const marker = generateMarker(markerData);

      kakao.maps.event.addListener(marker, "click", () => {
        // TODO: Fix the timing issue when using 'useState'
        setSelectedOverlay(!!selectedOverlay ? null : overlays[index]);
      });

      markers.push(marker);

      if (index < origin.length - 1) {
        const nextMarkerData = origin[index + 1];
        const polyline = generatePolyline([markerData, nextMarkerData]);

        polylines.push(polyline);
      }
    });

    setPolylines(polylines);

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

  useEffect(() => {
    selectedOverlay?.setMap(kakaoMap);
    return () => {
      selectedOverlay?.setMap(null);
    };
  }, [kakaoMap, selectedOverlay]);

  useEffect(
    () => () => {
      markers?.forEach((elem) => elem.setMap(null));
      polylines?.forEach((elem) => elem.setMap(null));
    },
    []
  );

  return <React.Fragment></React.Fragment>;
}

export default React.memo(KakaoMapContainer);
