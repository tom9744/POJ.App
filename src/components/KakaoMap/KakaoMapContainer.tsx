import React, { useEffect, useState } from "react";
import "./CustomOverlay.scss";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

function KakaoMapContainer(props: { kakaoMap: any; locations: any[] }) {
  const [overlays, setOverlays] = useState<any[]>([]);

  const generateOverlay = (position: any) => {
    const content = document.createElement("div");
    content.innerHTML = `<div class ="custom-overlay">
        <span class="left"></span>
        <span class="center">카카오!</span>
        <span class="right"></span>
      </div>`;

    const customOverlay = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
    });

    return customOverlay;
  };

  useEffect(() => {
    const positions = props.locations.map((delta) => {
      return new kakao.maps.LatLng(
        37.424245 + delta / 500,
        126.992091 + delta / 500
      );
    });
    const overlays = positions.map((position) => {
      return generateOverlay(position);
    });

    setOverlays(overlays);
  }, [props.locations]);

  useEffect(() => {
    overlays.forEach((marker) => {
      marker.setMap(props.kakaoMap);
    });

    return () => {
      overlays.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [overlays]);

  return <React.Fragment></React.Fragment>;
}

export default KakaoMapContainer;
