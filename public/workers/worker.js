/* eslint-disable */
self.onmessage = async (event) => {
  const { data } = event;

  const images = await Promise.all(
    data.map(async (url) => {
      try {
        const response = await fetch(url);
        const fileBlob = await response.blob();

        if (/image\/.+/.test(fileBlob.type)) {
          return URL.createObjectURL(fileBlob);
        } else {
          throw new Error("Invalid Blob Type Error");
        }
      } catch (error) {
        console.error(error);
      }
    })
  );

  setTimeout(() => {
    self.postMessage(images);
  }, 1000);
};
