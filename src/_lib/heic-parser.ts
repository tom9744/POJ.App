import { FileTypeBox } from "./models/FileTypeBox.model";
import { MetaBox } from "./models/MetaBox.model";
import { readUint32AsString } from "./utils";

function findMetaBoxOffset(arrayBuffer: ArrayBuffer): number {
  const dataView = new DataView(arrayBuffer);

  for (let offset = 0; offset < dataView.byteLength; offset++) {
    const value = readUint32AsString(dataView, offset);

    if (value === "meta") {
      return offset - 4;
    }
  }

  throw new Error("Could not find a meta box from the array buffer");
}

export function parseHEIC(arrayBuffer: ArrayBuffer) {
  if (!arrayBuffer) {
    return;
  }

  const dataView = new DataView(arrayBuffer);

  const fileTypeBoxSize = dataView.getUint32(0);
  const fileTypeArrayBuffer = arrayBuffer.slice(0, fileTypeBoxSize);
  const fileTypeBox = new FileTypeBox(fileTypeArrayBuffer);

  const metaBoxOffset = findMetaBoxOffset(arrayBuffer);
  const metaBoxSize = dataView.getUint32(metaBoxOffset);
  const metaArrayBuffer = arrayBuffer.slice(metaBoxOffset, metaBoxSize);
  const metaBox = new MetaBox(metaArrayBuffer);

  console.log(metaBox.itemInfoBox);
}
