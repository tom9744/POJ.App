import { useState, useEffect, useCallback } from "react";
import { generateKakaoLatLng, MarkerData } from "../components/KakaoMap/KakaoMapService";

declare const kakao: any;

export interface PolylineOption {
  strokeWeight?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeStyle?: string;
}

const usePolyline = (
  option: PolylineOption
): { polylines: any[]; generatePolylines: (markerDataList: MarkerData[]) => void } => {
  const [polylines, setPolylines] = useState<any[]>([]);

  const generatePolyline = useCallback(
    ([from, to]: [MarkerData, MarkerData]): any => {
      return new kakao.maps.Polyline({
        path: [generateKakaoLatLng(from.coordinate), generateKakaoLatLng(to.coordinate)],
        strokeWeight: option.strokeWeight ?? 5,
        strokeColor: option.strokeColor ?? "#FFFFFF",
        strokeOpacity: option.strokeOpacity ?? 1,
        strokeStyle: option.strokeStyle ?? "solid",
      });
    },
    [option]
  );

  const generatePolylines = useCallback(
    (markerDataList: MarkerData[]): void => {
      const polylines = markerDataList
        .map((markerData, index, originArray): [MarkerData, MarkerData] => [markerData, originArray[index + 1]])
        .filter(([from, to]) => !!from && !!to)
        .map(([from, to]): any => generatePolyline([from, to]));

      setPolylines(polylines);
    },
    [generatePolyline]
  );

  useEffect(() => {
    return () => {
      polylines.forEach((elem) => elem.setMap(null));
    };
  }, []);

  return { polylines, generatePolylines };
};

export default usePolyline;
