import { FileTypeBox } from "./models/FileTypeBox.model";

export function parseHEIC(arrayBuffer: ArrayBuffer) {
  if (!arrayBuffer) {
    return;
  }

  const dataView = new DataView(arrayBuffer);

  const fileTypeBoxSize = dataView.getUint32(0);
  const fileTypeArrayBuffer = arrayBuffer.slice(0, fileTypeBoxSize);
  const fileTypeBox = new FileTypeBox(fileTypeArrayBuffer);
}
