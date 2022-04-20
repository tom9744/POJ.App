import { useCallback } from "react";
import { IPhotoData } from "../../../pages/JourneyList/JourneyData.model";
import { FaCheckCircle } from "react-icons/fa";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  photoList: IPhotoData[];
  selectedPhotoIds: number[];
  onSelectPhoto: (photoId: number) => void;
};

function PhotoGrid({ photoList, selectedPhotoIds, onSelectPhoto }: PhotoGridProps) {
  const isSelected = useCallback((photoId: number): boolean => selectedPhotoIds.includes(photoId), [selectedPhotoIds]);

  return (
    <div className={classes["photo-grid"]}>
      {photoList.map((photo, index) => (
        <div key={photo.id} className={`${classes["photo-cell"]} ${isSelected(photo.id) ? classes.selected : ""}`} onClick={() => onSelectPhoto(photo.id)}>
          <img className={classes.image} src={photo.thumbnailPath} alt={`${index + 1}번 이미지`} height={250} width={250} />

          {isSelected(photo.id) ? <FaCheckCircle className={classes["check-icon"]}></FaCheckCircle> : null}
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
