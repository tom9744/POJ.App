import React, { useEffect, useState } from "react";
import { Coordinate, generateMarker, generateOverlay } from "./KakaoMapService";
import "./CustomOverlay.scss";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

function KakaoMapContainer(props: { kakaoMap: any; locations: any[] }) {
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

  let selectedOverlay: any = null;

  useEffect(() => {
    const positions: Coordinate[] = props.locations.map((delta) => {
      return {
        latitude: 37.424245 + delta / 500,
        longitude: 126.992091 + delta / 500,
      };
    });

    const newOverlays = positions.map((position) => generateOverlay(position));
    const newMarkers = positions.map((position, index) => {
      const newMarker = generateMarker(position);

      kakao.maps.event.addListener(newMarker, "click", () => {
        const targetOverlay = newOverlays[index];

        // TODO: Fix the timing issue when using 'useState'
        if (!!selectedOverlay) {
          selectedOverlay.setMap(null);
          selectedOverlay = null;
        }
        targetOverlay.setMap(props.kakaoMap);
        selectedOverlay = targetOverlay;
      });

      return newMarker;
    });

    setOverlays(newOverlays);
    setMarkers(newMarkers);
  }, [props.locations]);

  useEffect(() => {
    markers.forEach((marker) => marker.setMap(props.kakaoMap));

    return () => {
      [...markers, ...overlays].forEach((elem) => elem.setMap(null)); // Clear all elements
    };
  }, [markers]);

  return <React.Fragment></React.Fragment>;
}

export default KakaoMapContainer;
