import React, { useEffect, useRef, useState } from "react";
import { RawPhoto } from "../JourneyExplorer/Journey.interface";
import { INITIAL_LATLANG, INITIAL_LEVEL } from "./KakaoMap.constant";
import classes from "./KakaoMap.module.scss";
import KakaoMapContainer from "./KakaoMapContainer";
import {
  Coordinate,
  filterOverseasMarkers,
  generateKakaoLatLng,
  getAverageCoordinate,
  isValidCoordinate,
  MarkerData,
} from "./KakaoMapService";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type KakaoMapProps = {
  markerDataList: MarkerData[];
  selectedMarker: MarkerData | null;
};

function KakaoMap({ markerDataList, selectedMarker }: KakaoMapProps) {
  const [validMarkers, setValidMarkers] = useState<MarkerData[]>([]);
  const [map, setMap] = useState<any>(null);

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

  useEffect(() => {
    if (selectedMarker && isValidCoordinate(selectedMarker.coordinate)) {
      const { coordinate } = selectedMarker;

      map.panTo(generateKakaoLatLng(coordinate));
    }
  }, [map, selectedMarker]);

  useEffect(() => {
    if (map && markerDataList.length === 0) {
      setValidMarkers([]);
    }
  }, [map, markerDataList]);

  // Move the map to the average coordinate of the selected journey.
  useEffect(() => {
    if (map && markerDataList.length > 0) {
      const validMarkers = filterOverseasMarkers(markerDataList);
      const averageLatitude = getAverageCoordinate(validMarkers).latitude / validMarkers.length;
      const averageLongitude = getAverageCoordinate(validMarkers).longitude / validMarkers.length;
      const averageCoordinate = { latitude: averageLatitude, longitude: averageLongitude };

      if (isValidCoordinate(averageCoordinate)) {
        map.panTo(new kakao.maps.LatLng(averageLatitude, averageLongitude));
      }

      setValidMarkers(validMarkers);
    }
  }, [map, markerDataList]);

  return (
    <React.Fragment>
      <div id="kakao-map" className={classes.map} ref={mapContainer}></div>
      <KakaoMapContainer kakaoMap={map} markerDataList={validMarkers}></KakaoMapContainer>
    </React.Fragment>
  );
}

export default React.memo(KakaoMap);
