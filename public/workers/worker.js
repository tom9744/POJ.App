/* eslint-disable */
self.onmessage = async (event) => {
  const { data: photos } = event;

  const images = await Promise.all(
    photos.map(async (photo) => {
      const { path } = photo;

      try {
        const response = await fetch(path, { mode: "no-cors" });
        const fileBlob = await response.blob();

        if (/image\/.+/.test(fileBlob.type)) {
          return {
            ...photo,
            path: URL.createObjectURL(fileBlob),
          };
        } else {
          throw new Error("Invalid Blob Type Error");
        }
      } catch (error) {
        console.error(error);
      }
    })
  );

  self.postMessage(images);
};
