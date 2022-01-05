import React, { useEffect, useMemo, useState } from "react";
import { generateMarker, generateOverlay, generatePolyline, MarkerData } from "./KakaoMapService";
import "./CustomOverlay.scss";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapContainerProps = { kakaoMap: any; markerDataList: MarkerData[] };

function KakaoMapContainer({ kakaoMap, markerDataList }: KakaoMapContainerProps) {
  const [polylines, setPolylines] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

  const clusterer = useMemo(
    () =>
      new kakao.maps.MarkerClusterer({
        map: kakaoMap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 5, // 클러스터 할 최소 지도 레벨
      }),
    [kakaoMap]
  );

  let selectedOverlay: any = null;

  useEffect(() => {
    const polylines: any[] = [];
    const overlays: any[] = [];
    const markers: any[] = [];

    markerDataList.forEach((markerData, index, origin) => {
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

      overlays.push(overlay);
      markers.push(marker);

      if (index < origin.length - 1) {
        const nextMarkerData = origin[index + 1];
        const polyline = generatePolyline([markerData, nextMarkerData]);

        polylines.push(polyline);
      }
    });

    setPolylines(polylines);
    setOverlays(overlays);
    setMarkers(markers);
  }, [markerDataList]);

  useEffect(() => {
    [...markers, ...polylines].forEach((marker) => marker.setMap(kakaoMap));
    clusterer.addMarkers(markers);
    return () => {
      // NOTE: Clear all elements
      [...markers, ...overlays, ...polylines].forEach((elem) => elem.setMap(null));
      clusterer.removeMarkers(markers);
    };
  }, [kakaoMap, clusterer, markers, overlays, polylines]);

  return <React.Fragment></React.Fragment>;
}

export default KakaoMapContainer;
