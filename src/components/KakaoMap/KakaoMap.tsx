import React, { useEffect, useRef } from "react";
import "./KakaoMap.scss";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_MAP_CONFIG = {
  center: new window.kakao.maps.LatLng(33.450701, 126.570667),
  level: 10,
};

function KakaoMap() {
  // Reference of the DOM where the map will be displayed.
  const mapContainer = useRef(null);

  useEffect(() => {
    // Load the kakao API map into the DOM.
    new window.kakao.maps.Map(mapContainer.current, KAKAO_MAP_CONFIG);

    return () => {};
  }, []);

  return <div className="map" ref={mapContainer}></div>;
}

export default KakaoMap;
