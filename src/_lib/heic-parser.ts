import { ExifData } from "./models/ExifData/ExifData.model";
import { MetaBox } from "./models/MetaBox/MetaBox.model";

enum AllowedFileType {
  JPEG = "image/jpeg",
  HEIC = "image/heic",
}

function isAllowedFileType(fileType: string): boolean {
  return fileType === AllowedFileType.HEIC || fileType === AllowedFileType.JPEG;
}

function parseHEIC(arrayBuffer: ArrayBuffer) {
  if (!arrayBuffer) {
    return;
  }

  const metaBox = new MetaBox(arrayBuffer);
  const exifItemInfo = metaBox.itemInfoBox?.findExifItemInfo();

  if (!exifItemInfo) {
    return;
  }

  const exifItemLocation = metaBox.itemLocationBox?.finditemLocationById(
    exifItemInfo.itemId
  );

  if (!exifItemLocation?.extentInfos?.[0]) {
    return;
  }

  const exifData = new ExifData(
    arrayBuffer,
    exifItemLocation.extentInfos[0].extentOffset,
    exifItemLocation.extentInfos[0].extentLength
  );

  console.log(exifData);
}

function parseJPEG(arrayBuffer: ArrayBuffer) {
  console.log("JPEG!");
}

export async function extractExifTags(file: File) {
  if (!file || !isAllowedFileType(file.type)) {
    return;
  }

  const arrayBuffer = await file.arrayBuffer();

  switch (file.type) {
    case AllowedFileType.HEIC:
      parseHEIC(arrayBuffer);
      break;
    case AllowedFileType.JPEG:
      parseJPEG(arrayBuffer);
      break;
  }
}
