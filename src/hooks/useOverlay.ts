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

  const generateOverlays = useCallback(
    (markerDataList: MarkerData[]): any[] => {
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
      });

      return overlays;
    },
    [kakaoMap]
  );

  useEffect(() => {
    return () => {
      selectedOverlay?.setMap(null);
    };
  }, []);

  return { selectedOverlay, setSelectedOverlay, generateOverlays };
};

export default useOverlay;
