/* eslint-disable */

async function resizeImage(imageBitmap, maxSize) {
  const offscreenCanvas = new OffscreenCanvas(256, 256);
  const ctx = offscreenCanvas.getContext("2d");

  const { height, width } = imageBitmap;
  let resizeHeight = height;
  let resizeWidth = width;

  if (height > width) {
    if (height > maxSize) {
      resizeHeight = maxSize;
      resizeWidth *= maxSize / height;
    }
  } else {
    if (width > maxSize) {
      resizeHeight *= maxSize / width;
      resizeWidth = maxSize;
    }
  }

  offscreenCanvas.height = resizeHeight;
  offscreenCanvas.width = resizeWidth;
  ctx.drawImage(imageBitmap, 0, 0, resizeWidth, resizeHeight);

  const imageBlob = await offscreenCanvas.convertToBlob({
    type: "image/jpeg",
    quality: 0.5,
  });

  return imageBlob;
}

self.onmessage = async (event) => {
  const { data: images } = event;

  if (!images instanceof ImageBitmap) {
    return;
  }

  const resizedImages = await Promise.all(
    images.map(async (image) => {
      try {
        const imageBlob = await resizeImage(image, 640);

        if (/image\/.+/.test(imageBlob.type)) {
          return URL.createObjectURL(imageBlob);
        } else {
          throw new Error("Invalid Blob Type Error");
        }
      } catch (error) {
        console.error(error);
      }
    })
  );

  self.postMessage(resizedImages);
};
