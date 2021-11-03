import React, { useEffect, useReducer, useRef } from "react";
import { INITIAL_LATLANG, INITIAL_LEVEL } from "./KakaoMap.constant";
import classes from "./KakaoMap.module.scss";

// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

type MapAction =
  | { type: "MAP_CREATED"; payload: any }
  | { type: "MARKERS_CHANGED"; payload: any[] };

interface MapState {
  map: any;
  markers: any[];
}

const reducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case "MAP_CREATED":
      return {
        ...state,
        map: action.payload,
      };
    case "MARKERS_CHANGED":
      return {
        ...state,
        markers: action.payload,
      };
    default:
      throw new Error("Invalid action type has been dispatched.");
  }
};

function KakaoMap(props: { locations: any[] }) {
  const [state, dispatch] = useReducer(reducer, {
    map: null,
    markers: [],
  });

  // Reference of the DOM where the map will be displayed.
  const mapContainer = useRef(null);

  useEffect(() => {
    const mapCont = document.getElementById("kakao-map");
    const mapOptions = {
      center: new kakao.maps.LatLng(...INITIAL_LATLANG),
      level: 5,
    };
    const mapInstance = new kakao.maps.Map(mapCont, mapOptions); // Load the kakao API map into the DOM.

    dispatch({ type: "MAP_CREATED", payload: mapInstance }); // Save the map's instance into the reducer.

    return () => {};
  }, []);

  useEffect(() => {
    const markers = props.locations.map((delta) => {
      return new kakao.maps.Marker({
        position: new kakao.maps.LatLng(
          37.424245 + delta / 1000,
          126.992091 + delta / 1000
        ),
      });
    });

    dispatch({ type: "MARKERS_CHANGED", payload: markers });
  }, [props.locations]);

  useEffect(() => {
    state.markers.forEach((marker) => {
      marker.setMap(state.map);
    });

    return () => {
      state.markers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [state.map, state.markers]);

  return <div id="kakao-map" className={classes.map} ref={mapContainer}></div>;
}

export default KakaoMap;
