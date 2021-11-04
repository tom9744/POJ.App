import React, { useEffect, useRef, useState } from "react";
import { INITIAL_LATLANG, INITIAL_LEVEL } from "./KakaoMap.constant";
import classes from "./KakaoMap.module.scss";
import KakaoMapContainer from "./KakaoMapContainer";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

function KakaoMap(props: { locations: any[] }) {
  const [map, setMap] = useState(null);

  // Reference of the DOM where the map will be displayed.
  const mapContainer = useRef(null);

  useEffect(() => {
    const mapCont = document.getElementById("kakao-map");
    const mapOptions = {
      center: new kakao.maps.LatLng(...INITIAL_LATLANG),
      level: INITIAL_LEVEL,
    };
    const mapInstance = new kakao.maps.Map(mapCont, mapOptions); // Load the kakao API map into the DOM.

    setMap(mapInstance); // Save the map's instance into the reducer.
  }, []);

  return (
    <React.Fragment>
      <div id="kakao-map" className={classes.map} ref={mapContainer}></div>
      <KakaoMapContainer
        kakaoMap={map}
        locations={props.locations}
      ></KakaoMapContainer>
    </React.Fragment>
  );
}

export default KakaoMap;
