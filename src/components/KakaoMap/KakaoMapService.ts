// Let Typescript know there exists the 'kakao' namespace.
declare const kakao: any;

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export const generateOverlay = ({ latitude, longitude }: Coordinate) => {
  const position = new kakao.maps.LatLng(latitude, longitude);
  const customOverlay = new kakao.maps.CustomOverlay();

  const closeOverlay = () => {
    customOverlay.setMap(null);
  };

  const content = document.createElement("div");
  content.innerHTML = `<div class="custom-overlay">
      <span class="left"></span>
      <span class="center">카카오!</span>
      <span class="right"></span>
    </div>`;

  content.addEventListener("click", () => {
    closeOverlay();
  });

  customOverlay.setContent(content);
  customOverlay.setPosition(position);

  return customOverlay;
};

export const generateMarker = ({ latitude, longitude }: Coordinate) => {
  const position = new kakao.maps.LatLng(latitude, longitude);
  const newMarker = new kakao.maps.Marker({ position });

  return newMarker;
};
