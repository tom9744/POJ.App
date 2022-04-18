import { IPhotoData } from "../../../pages/JourneyList/JourneyData.model";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  photoList: IPhotoData[];
};

function PhotoGrid({ photoList }: PhotoGridProps) {
  return (
    <div className={classes["photo-grid"]}>
      {photoList.map((photo, index) => (
        <div key={photo.id} className={classes["photo-cell"]}>
          <img className={classes.image} src={photo.thumbnailPath} alt={`${index + 1}번 이미지`} height={250} width={250} />
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
