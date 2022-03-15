import { ExifData } from "./models/ExifData/ExifData.model";
import { MetaBox } from "./models/MetaBox/MetaBox.model";

enum AllowedFileType {
  JPEG = "image/jpeg",
  HEIC = "image/heic",
}

function isAllowedFileType(fileType: string): boolean {
  return fileType === AllowedFileType.HEIC || fileType === AllowedFileType.JPEG;
}

function findApp1Marker(arrayBuffer: ArrayBuffer): {
  offset: number;
  size: number;
} {
  const dataView = new DataView(arrayBuffer);

  for (let offset = 0; offset < arrayBuffer.byteLength - 2; offset += 2) {
    const value = dataView.getUint16(offset);

    // NOTE: App1 Marker, Exif 데이터 포함.
    if (value === 0xffe1) {
      return { offset, size: dataView.getUint16(offset + 2) };
    }

    // NOTE: Start of Scan, 헤더 영역 종료.
    if (value === 0xffda) {
      break;
    }
  }

  throw new Error("Could not find an APP1 marker from the array buffer");
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

function parseJPEG(arrayBuffer: ArrayBuffer): ExifData {
  const { offset, size } = findApp1Marker(arrayBuffer);

  return new ExifData(arrayBuffer, offset, size);
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
