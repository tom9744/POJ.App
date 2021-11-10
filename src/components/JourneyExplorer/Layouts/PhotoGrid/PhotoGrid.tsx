import React from "react";
import { RawPhoto } from "../../Journey.interface";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  photos: RawPhoto[];
};

function PhotoGrid(props: PhotoGridProps) {
  return (
    <div className={classes["photo-grid"]}>
      {props.photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.path || "/images/dummy.jpg"}
          alt={photo.filename}
          className={classes.image}
        />
      ))}
    </div>
  );
}

export default PhotoGrid;
