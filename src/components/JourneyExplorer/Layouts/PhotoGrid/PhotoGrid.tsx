import React, { useEffect, useMemo, useState } from "react";
import { RawPhoto } from "../../Journey.interface";
import classes from "./PhotoGrid.module.scss";

type PhotoGridProps = {
  photos: RawPhoto[];
};

function PhotoGrid({ photos }: PhotoGridProps) {
  const [imageBlobs, setImageBlobs] = useState<string[]>([]);

  const worker = useMemo(() => new Worker("./workers/worker.js"), []);

  useEffect(() => {
    const pathUrls = photos.map((photo) => photo.path);

    setImageBlobs(new Array(pathUrls.length).fill(null));

    worker.postMessage(pathUrls);
  }, [worker, photos]);

  useEffect(() => {
    worker.onmessage = (event: MessageEvent) => {
      setImageBlobs(event.data);
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
        />
      ))}
    </div>
  );
}

export default PhotoGrid;
