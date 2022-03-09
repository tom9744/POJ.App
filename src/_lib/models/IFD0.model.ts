import {
  IFDEntry,
  IFDEntryFactory,
  IFDPayload,
  IIFDEntry,
} from "./IFDEntry.model";

export interface IIFD0 {
  entries: IIFDEntry[];
}

export class IFD0 implements IIFD0 {
  private _nextIFDsOffset: number;
  private _entries: IFDEntry[];

  get entries(): IFDEntry[] {
    return [...this._entries];
  }

  get resolvedEntries(): IFDPayload[] {
    return this._entries.map((entry) => entry.resolvePayload());
  }

  get subIFDsOffset(): number {
    const subIFDEntry = this._entries.find(({ tag }) => tag === 0x8769);

    return subIFDEntry ? subIFDEntry.payload + 10 : 0;
  }

  get nextIFDsOffset(): number {
    return this._nextIFDsOffset;
  }

  constructor(dataView: DataView, firstIFDOffset: number, isLittle: boolean) {
    const baseOffset = firstIFDOffset + 10; // NOTE: First IFD's Offset 값은 Byte Align Offset 값을 기준으로 합니다.
    const entryCount = dataView.getUint16(baseOffset, isLittle);
    const entries: IFDEntry[] = [];

    for (let n = 0; n < entryCount; n++) {
      const firstEntryOffset = baseOffset + 2; // NOTE: Entry Count 데이터 (2 Bytes)를 제외한 Offset.
      const entry: IFDEntry = IFDEntryFactory(
        dataView,
        firstEntryOffset + 12 * n, // NOTE: IFD Entry는 12 Bytes로 구성됩니다.
        isLittle
      );

      entries.push(entry);
    }

    this._entries = entries;
    this._nextIFDsOffset = dataView.getUint32(
      baseOffset + 2 + entries.length * 12,
      isLittle
    );
  }
}
