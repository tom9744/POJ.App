import React, { useEffect, useMemo, useState } from "react";
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
  const [imageBlobs, setImageBlobs] = useState<string[]>([]);

  // TODO: Worker gets terminated during the component re-evaluation, and never gets instanciated.
  const worker = useMemo(() => new Worker("./workers/worker.js"), [photos]);

  useEffect(() => {
    const pathUrls = photos.map((photo) => photo.path);

    setImageBlobs(new Array(pathUrls.length).fill(null));

    setTimeout(() => worker.postMessage(pathUrls), 500);

    return () => {
      worker.terminate(); // NOTE: To avoid memory leak error.
    };
  }, [worker, photos]);

  useEffect(() => {
    worker.onmessage = async (event: MessageEvent) => {
      const imageBlobPaths = event.data as string[];

      // NOTE: Wait for all images to be pre-loaded.
      await Promise.all(imageBlobPaths.map((path) => loadImage(path)));

      setImageBlobs(imageBlobPaths);
    };

    return () => {
      worker.terminate(); // NOTE: To avoid memory leak error.
    };
  }, [worker]);

  return (
    <div className={classes["photo-grid"]}>
      {imageBlobs.map((imageBlob, index) => (
        <div
          key={index}
          className={`${classes["photo-cell"]} ${
            isEditing ? classes.shake : ""
          }`}
        >
          <img
            className={classes.image}
            src={imageBlob || "/images/dummy.jpg"}
            alt={`${index + 1}번 이미지`}
            height={250}
            width={250}
          />

          {isEditing ? (
            <button
              className={classes["delete-button"]}
              onClick={() => onDeletePhoto(photos[index])}
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
