import React, { useState, useCallback, useEffect } from "react";
import { generateKakaoLatLng, MarkerData } from "../components/KakaoMap/KakaoMapService";

declare const kakao: any;

const useOverlay = (
  kakaoMap: any
): {
  selectedOverlay: any;
  setSelectedOverlay: React.Dispatch<any>;
  generateOverlays: (markerDataList: MarkerData[]) => any[];
} => {
  const [selectedOverlay, setSelectedOverlay] = useState<any>(null);

  const createBaseOverlay = useCallback((markerDataList: MarkerData[]) => {
    const createInnerHTML = (index: number): string => {
      return `
        ${index === 0 ? "" : '<div class="custom-overlay-left-arrow">←</div>'}
        <div class="custom-overlay">
          <img class="image" src="${markerDataList[index].path}"/>
        </div>
        ${index === markerDataList.length - 1 ? "" : '<div class="custom-overlay-right-arrow">→</div>'}`;
    };

    return markerDataList.map(({ coordinate }, index, origin) => {
      const overlay = new kakao.maps.CustomOverlay({
        position: generateKakaoLatLng(coordinate),
      });

      const content = document.createElement("div");
      content.className = "custom-overlay-wrapper";
      content.innerHTML = createInnerHTML(index);

      overlay.setContent(content);
      return overlay;
    });
  }, []);

  const generateOverlays = useCallback(
    (markerDataList: MarkerData[]): any[] => {
      // NOTE: 먼저 내용이 지정되지 않은 Overlay를 생성합니다.
      return createBaseOverlay(markerDataList).map((overlay, index, origin) => {
        const prevOverlay = origin[index - 1];
        const nextOverlay = origin[index + 1];

        overlay
          .getContent()
          .querySelector(".custom-overlay-left-arrow")
          ?.addEventListener("click", () => {
            setSelectedOverlay(prevOverlay);
            kakaoMap.panTo(prevOverlay.getPosition());
          });

        overlay
          .getContent()
          .querySelector(".custom-overlay-right-arrow")
          ?.addEventListener("click", () => {
            setSelectedOverlay(nextOverlay);
            kakaoMap.panTo(nextOverlay.getPosition());
          });

        overlay
          .getContent()
          .querySelector(".custom-overlay")
          ?.addEventListener("click", () => {
            setSelectedOverlay(null);
          });

        return overlay;
      });
    },
    [kakaoMap, createBaseOverlay]
  );

  useEffect(() => {
    selectedOverlay?.setMap(kakaoMap);
    return () => {
      selectedOverlay?.setMap(null);
    };
  }, [kakaoMap, selectedOverlay]);

  useEffect(() => {
    return () => {
      selectedOverlay?.setMap(null);
    };
  }, []);

  return { selectedOverlay, setSelectedOverlay, generateOverlays };
};

export default useOverlay;
