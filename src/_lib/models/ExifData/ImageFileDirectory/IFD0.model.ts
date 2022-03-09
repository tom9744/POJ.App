import { IFDEntry, IIFDEntry } from "./IFDEntry.model";

export interface IIFD0 {
  entries: IIFDEntry[];
  subIFDsOffset: number;
  nextIFDsOffset: number;
}

export class IFD0 implements IIFD0 {
  private _nextIFDsOffset: number;
  private _subIFDsOffset: number;
  private _entries: IFDEntry[];

  get entries(): IFDEntry[] {
    return [...this._entries];
  }

  get subIFDsOffset(): number {
    return this._subIFDsOffset;
  }

  get nextIFDsOffset(): number {
    return this._nextIFDsOffset;
  }

  constructor(dataView: DataView, firstIFDOffset: number, isLittle: boolean) {
    const baseOffset = firstIFDOffset + 10; // NOTE: First IFD's Offset 값은 Byte Align Offset 값을 기준으로 합니다.
    const entryCount = dataView.getUint16(baseOffset, isLittle);
    const firstEntryOffset = baseOffset + 2; // NOTE: Entry Count 데이터 (2 Bytes)를 제외한 Offset.
    const entries: IFDEntry[] = [];

    for (let n = 0; n < entryCount; n++) {
      const entry = new IFDEntry(
        dataView,
        firstEntryOffset + 12 * n, // NOTE: IFD Entry는 12 Bytes로 구성됩니다.
        isLittle
      );

      entries.push(entry);
    }

    const subIFDEntry = entries.find((entry) => entry.isSubIFDEntry);
    const lastDataOffset = firstEntryOffset + entries.length * 12;

    this._entries = entries;
    this._nextIFDsOffset = dataView.getUint32(lastDataOffset, isLittle);
    this._subIFDsOffset = subIFDEntry?.payload as number;
  }
}
