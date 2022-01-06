import React, { useCallback, useEffect, useState } from "react";
import { generateKakaoLatLng, generateMarker, generatePolyline, MarkerData } from "./KakaoMapService";
import "./CustomOverlay.scss";
import useCluster from "../../hooks/useCluster";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapContainerProps = { kakaoMap: any; markerDataList: MarkerData[] };

function KakaoMapContainer({ kakaoMap, markerDataList }: KakaoMapContainerProps) {
  const [polylines, setPolylines] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const clusterer = useCluster(kakaoMap);

  let selectedOverlay: any = null;

  const generateOverlays = useCallback(
    (markerDataList: MarkerData[]) => {
      // NOTE: 먼저 내용이 지정되지 않은 Overlay를 생성합니다.
      const overlays = markerDataList.map(({ coordinate, path }, index, origin) => {
        const overlay = new kakao.maps.CustomOverlay({
          position: generateKakaoLatLng(coordinate),
        });

        const content = document.createElement("div");
        content.className = "custom-overlay-wrapper";
        content.innerHTML = `
        ${index === 0 ? "" : '<div class="custom-overlay-left-arrow">←</div>'}
        <div class="custom-overlay">
          <img class="image" src="${path}"/>
        </div>
        ${index === origin.length - 1 ? "" : '<div class="custom-overlay-right-arrow">→</div>'}`;

        overlay.setContent(content);
        return overlay;
      });

      overlays.forEach((overlay, index, origin) => {
        if (!overlay.getContent()) {
          return;
        }

        const prevOverlay = origin[index - 1];
        const nextOverlay = origin[index + 1];

        overlay
          .getContent()
          .querySelector(".custom-overlay-left-arrow")
          ?.addEventListener("click", () => {
            overlay.setMap(null);
            prevOverlay.setMap(kakaoMap);
            kakaoMap.panTo(prevOverlay.getPosition());
          });

        overlay
          .getContent()
          .querySelector(".custom-overlay-right-arrow")
          ?.addEventListener("click", () => {
            overlay.setMap(null);
            nextOverlay.setMap(kakaoMap);
            kakaoMap.panTo(nextOverlay.getPosition());
          });

        overlay
          .getContent()
          .querySelector(".custom-overlay")
          .addEventListener("click", () => {
            overlay.setMap(null);
          });
      });

      return overlays;
    },
    [kakaoMap]
  );

  useEffect(() => {
    const polylines: any[] = [];
    const overlays = generateOverlays(markerDataList);
    const markers: any[] = [];

    markerDataList.forEach((markerData, index, origin) => {
      const marker = generateMarker(markerData);

      kakao.maps.event.addListener(marker, "click", () => {
        // TODO: Fix the timing issue when using 'useState'
        if (!!selectedOverlay) {
          selectedOverlay.setMap(null);
          selectedOverlay = null;
        }
        overlays[index].setMap(kakaoMap);
        selectedOverlay = overlays[index];
      });

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
