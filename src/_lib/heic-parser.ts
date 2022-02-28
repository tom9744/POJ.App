import { MetaBox } from "./models/MetaBox.model";

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

  const exifDataView = new DataView(
    arrayBuffer.slice(
      exifItemLocation.extentInfos[0].extentOffset,
      exifItemLocation.extentInfos[0].extentLength
    )
  );

  console.log(
    exifItemLocation.extentInfos[0].extentOffset,
    exifItemLocation.extentInfos[0].extentLength
  );
  console.log(exifDataView);
}
