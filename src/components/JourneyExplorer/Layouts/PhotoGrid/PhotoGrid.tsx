import React, { useEffect, useState } from "react";
import { RawPhoto } from "../../Journey.interface";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  isEditing: boolean;
  photos: RawPhoto[];
  onDeletePhoto: (photo: RawPhoto) => void;
};

function loadImage(imagePath: string): Promise<boolean> {
  return new Promise((reslove, reject) => {
    const image = new Image();
    image.src = imagePath;
    image.onload = () => reslove(true);
    image.onerror = () => reject(false);
  });
}

function PhotoGrid({ isEditing, photos, onDeletePhoto }: PhotoGridProps) {
  const [loadedPhotos, setLoadedPhotos] = useState<RawPhoto[]>([]);

  // TODO: Find a better solution to improve speed.
  useEffect(() => {
    const worker = new Worker("./workers/worker.js");
    const dummyPhotos = photos.map((photo) => ({
      ...photo,
      path: "/images/dummy.jpg",
    }));

    worker.onmessage = async (event: MessageEvent<RawPhoto[]>) => {
      const { data: loadedPhotos } = event;

      // NOTE: Wait for all images to be pre-loaded.
      await Promise.all(loadedPhotos.map(({ path }) => loadImage(path)));

      setLoadedPhotos(loadedPhotos);
    };

    setTimeout(() => worker.postMessage(photos), 500);
    setLoadedPhotos(dummyPhotos);

    return () => {
      worker.terminate(); // NOTE: To avoid memory leak error.
    };
  }, [photos]);

  return (
    <div className={classes["photo-grid"]}>
      {loadedPhotos.map((photo, index) => (
        <div
          key={photo.id}
          className={`${classes["photo-cell"]} ${
            isEditing ? classes.shake : ""
          }`}
        >
          <img
            className={classes.image}
            src={photo.path}
            alt={`${index + 1}번 이미지`}
            height={250}
            width={250}
          />

          {isEditing ? (
            <button
              className={classes["delete-button"]}
              onClick={() => onDeletePhoto(photo)}
            >
              ×
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
