import { ExifData } from "./models/ExifData/ExifData.model";
import { MetaBox } from "./models/MetaBox/MetaBox.model";

export function parseHEIC(arrayBuffer: ArrayBuffer) {
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

  console.log(exifData.IFD0Entries);
  console.log(exifData.subIFDEntries);
}
