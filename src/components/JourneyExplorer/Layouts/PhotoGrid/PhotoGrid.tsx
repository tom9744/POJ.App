import React, { useEffect, useMemo, useState } from "react";
import { RawPhoto } from "../../Journey.interface";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  photos: RawPhoto[];
};

function loadImage(imagePath: string): Promise<boolean> {
  return new Promise((reslove, reject) => {
    const image = new Image();
    image.src = imagePath;
    image.onload = () => reslove(true);
    image.onerror = () => reject(false);
  });
}

function PhotoGrid({ photos }: PhotoGridProps) {
  const [imageBlobs, setImageBlobs] = useState<string[]>([]);

  // TODO: Worker gets terminated during the component re-evaluation, and never gets instanciated.
  const worker = useMemo(() => new Worker("./workers/worker.js"), [photos]);

  useEffect(() => {
    const pathUrls = photos.map((photo) => photo.path);

    setImageBlobs(new Array(pathUrls.length).fill(null));

    worker.postMessage(pathUrls);

    return () => {
      worker.terminate(); // NOTE: To avoid memory leak error.
    };
  }, [worker, photos]);

  useEffect(() => {
    worker.onmessage = async (event: MessageEvent) => {
      const imageBlobPaths = event.data as string[];

      // NOTE: Wait for all images to be pre-loaded.
      await Promise.all(imageBlobPaths.map((path) => loadImage(path)));

      setImageBlobs(event.data);
    };

    return () => {
      worker.terminate(); // NOTE: To avoid memory leak error.
    };
  }, [worker]);

  return (
    <div className={classes["photo-grid"]}>
      {imageBlobs.map((imageBlob, index) => (
        <img
          key={index}
          src={imageBlob || "/images/dummy.jpg"}
          alt={photos[index].filename}
          className={classes.image}
          height={250}
          width={250}
        />
      ))}
    </div>
  );
}

export default PhotoGrid;
