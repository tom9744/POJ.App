// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

const NORTHERNMOST_LATITUDE = 43;
const SOUTHERNMOST_LATITUDE = 33;
const WESTERNMOST_LONGITUDE = 124;
const EASTERNMOST_LONGITUDE = 132;

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MarkerData {
  id: number;
  path: string;
  coordinate: Coordinate;
}

export const generateKakaoLatLng = (coordinate: Coordinate): any => {
  const { latitude, longitude } = coordinate;

  return new kakao.maps.LatLng(latitude, longitude);
};

export const generateMarker = ({ coordinate }: MarkerData): any => {
  const position = generateKakaoLatLng(coordinate);
  const newMarker = new kakao.maps.Marker({ position });

  return newMarker;
};

export const isValidCoordinate = (coordinate: Coordinate): boolean => {
  const { latitude, longitude } = coordinate;

  return (
    latitude > SOUTHERNMOST_LATITUDE &&
    latitude < NORTHERNMOST_LATITUDE &&
    longitude > WESTERNMOST_LONGITUDE &&
    longitude < EASTERNMOST_LONGITUDE
  );
};

export const filterOverseasMarkers = (markers: MarkerData[]): MarkerData[] => {
  return markers.filter(({ coordinate }) => isValidCoordinate(coordinate));
};

export const getAverageCoordinate = (markers: MarkerData[]): Coordinate => {
  return markers
    .map(({ coordinate }): Coordinate => {
      return { ...coordinate };
    })
    .reduce(
      ({ latitude, longitude }, acc) => {
        acc.latitude += latitude;
        acc.longitude += longitude;

        return acc;
      },
      { latitude: 0, longitude: 0 }
    );
};
