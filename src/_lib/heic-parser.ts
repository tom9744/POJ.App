import { MetaBox } from "./models/MetaBox.model";

export function parseHEIC(arrayBuffer: ArrayBuffer) {
  if (!arrayBuffer) {
    return;
  }

  const metaBox = new MetaBox(arrayBuffer);
  const itemInfoBox = metaBox.itemInfoBox;
  const itemLocationBox = metaBox.itemLocationBox;

  const exifItemInfo = itemInfoBox?.itemInfos.find(
    (itemInfoEntry) => itemInfoEntry.itemName === "Exif"
  );
  const exifItemLocation = itemLocationBox?.items.find(
    (itemLocation) => itemLocation.itemId === exifItemInfo?.itemId
  );

  const dataView = new DataView(arrayBuffer);
  const prefixSize =
    4 + dataView.getUint32(exifItemLocation!.extentInfos[0]!.extentOffset);
  const exifOffset =
    prefixSize + exifItemLocation!.extentInfos[0]!.extentOffset;

  console.log(
    new DataView(
      arrayBuffer.slice(
        exifItemLocation!.extentInfos[0]!.extentOffset,
        exifItemLocation!.extentInfos[0]!.extentLength
      )
    )
  );
  console.log(dataView.getUint16(exifOffset).toString(16));
}
