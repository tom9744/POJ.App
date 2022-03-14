import { IIFDEntry } from "./IFDEntry.model";
import { ImageFileDirectory } from "./ImageFileDirectory.model";

export interface IIFD0 {
  entries: IIFDEntry[];
  subIFDsOffset: number;
  nextIFDsOffset: number;
}

export class IFD0 extends ImageFileDirectory implements IIFD0 {
  private _nextIFDsOffset: number;
  private _subIFDsOffset: number;

  get subIFDsOffset(): number {
    return this._subIFDsOffset;
  }

  get nextIFDsOffset(): number {
    return this._nextIFDsOffset;
  }

  constructor(dataView: DataView, firstIFDOffset: number, isLittle: boolean) {
    super(dataView, firstIFDOffset, isLittle);

    // NOTE: SubIFD의 Offset 값이 저장된 엔트리(= ExifOffset)를 찾습니다.
    const exifOffsetEntry = this._entries.find((entry) => entry.isExifOffset);
    // NOTE: IFD0 엔트리 목록이 끝나는 위치에 다음 IFD(= IFD1)의 Offset이 저장되어 있습니다.
    const lastOffset = this._firstEntryOffset + this._entries.length * 12;

    this._subIFDsOffset = exifOffsetEntry?.payload as number;
    this._nextIFDsOffset = dataView.getUint32(lastOffset, isLittle);
  }
}
