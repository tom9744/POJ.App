import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppDispatchContext } from "../../../../App";
import { ProcessedPhoto } from "../../Journey.interface";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  isEditing: boolean;
  photos: ProcessedPhoto[];
  onDeletePhoto: (photo: ProcessedPhoto) => void;
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
  const appDispatch = useContext(AppDispatchContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedPhotos, setLoadedPhotos] = useState<ProcessedPhoto[]>([]);

  // TODO: Find a better solution to improve speed.
  useEffect(() => {
    const worker = new Worker("./workers/worker.js");
    const dummyPhotos = photos.map((photo) => ({
      ...photo,
      path: "/images/dummy.jpg",
    }));

    worker.onmessage = async (event: MessageEvent<ProcessedPhoto[]>) => {
      const { data: loadedPhotos } = event;

      // NOTE: Wait for all images to be pre-loaded.
      await Promise.all(loadedPhotos.map(({ path }) => loadImage(path)));

      setLoadedPhotos(loadedPhotos);
      setIsLoading(false);
    };

    setTimeout(() => worker.postMessage(photos), 500);
    setLoadedPhotos(dummyPhotos);
    setIsLoading(true);

    return () => {
      worker.terminate(); // NOTE: To avoid memory leak error.

      appDispatch({ type: "SET_SELECTED_PHOTO", photo: null });
    };
  }, [photos, appDispatch]);

  const selectPhoto = useCallback(
    (photo: ProcessedPhoto) => {
      if (isLoading || isEditing) return;

      appDispatch({ type: "SET_SELECTED_PHOTO", photo });
    },
    [isLoading, isEditing, appDispatch]
  );

  return (
    <div className={classes["photo-grid"]}>
      {loadedPhotos.map((photo, index) => (
        <div key={photo.id} className={`${classes["photo-cell"]} ${isEditing ? classes.shake : ""}`}>
          <img
            className={classes.image}
            src={photo.path}
            alt={`${index + 1}번 이미지`}
            height={250}
            width={250}
            onClick={() => selectPhoto(photo)}
          />

          {isEditing ? (
            <button className={classes["delete-button"]} onClick={() => onDeletePhoto(photo)}>
              ×
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
