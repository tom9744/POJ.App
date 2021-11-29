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

export const generateOverlay = ({ coordinate, path }: MarkerData): any => {
  const { latitude, longitude } = coordinate;
  const position = new kakao.maps.LatLng(latitude, longitude);
  const customOverlay = new kakao.maps.CustomOverlay();

  const content = document.createElement("div");
  content.className = "custom-overlay-wrapper";
  content.innerHTML = `<div class="custom-overlay">
      <img class="image" src="${path}"/>
    </div>`;

  content.addEventListener("click", () => {
    customOverlay.setMap(null);
  });

  customOverlay.setContent(content);
  customOverlay.setPosition(position);

  return customOverlay;
};

export const generateMarker = ({ latitude, longitude }: Coordinate): any => {
  const position = new kakao.maps.LatLng(latitude, longitude);
  const newMarker = new kakao.maps.Marker({ position });

  return newMarker;
};

export const isValidCoordinate = ({
  latitude,
  longitude,
}: Coordinate): boolean => {
  return (
    latitude > SOUTHERNMOST_LATITUDE &&
    latitude < NORTHERNMOST_LATITUDE &&
    longitude > WESTERNMOST_LONGITUDE &&
    longitude < EASTERNMOST_LONGITUDE
  );
};
