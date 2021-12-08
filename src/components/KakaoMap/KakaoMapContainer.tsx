import React, { useEffect, useState } from "react";
import {
  generateKakaoLatLng,
  generateMarker,
  generateOverlay,
  generatePolyline,
  MarkerData,
} from "./KakaoMapService";
import "./CustomOverlay.scss";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapContainerProps = { kakaoMap: any; markerDataList: MarkerData[] };

function KakaoMapContainer({
  kakaoMap,
  markerDataList,
}: KakaoMapContainerProps) {
  const [kakaoCoordinates, setKakaoCoordinates] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

  let selectedOverlay: any = null;

  useEffect(() => {
    const kakaoCoordinates: any[] = [];
    const overlays: any[] = [];
    const markers: any[] = [];

    markerDataList.forEach((markerData) => {
      const { coordinate } = markerData;
      const kakaoCoordinate = generateKakaoLatLng(coordinate);
      const overlay = generateOverlay(markerData);
      const marker = generateMarker(markerData);

      kakao.maps.event.addListener(marker, "click", () => {
        // TODO: Fix the timing issue when using 'useState'
        if (!!selectedOverlay) {
          selectedOverlay.setMap(null);
          selectedOverlay = null;
        }
        overlay.setMap(kakaoMap);
        selectedOverlay = overlay;
      });

      kakaoCoordinates.push(kakaoCoordinate);
      overlays.push(overlay);
      markers.push(marker);
    });

    setKakaoCoordinates(kakaoCoordinates);
    setOverlays(overlays);
    setMarkers(markers);
  }, [markerDataList]);

  useEffect(() => {
    const polyline = generatePolyline(kakaoCoordinates);

    [...markers, polyline].forEach((marker) => marker.setMap(kakaoMap));

    return () => {
      [...markers, ...overlays, polyline].forEach((elem) => elem.setMap(null)); // Clear all elements
    };
  }, [kakaoMap, markers, overlays, kakaoCoordinates]);

  return <React.Fragment></React.Fragment>;
}

export default KakaoMapContainer;
