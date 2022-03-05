import { readDataViewAsString } from "../utils";
import { IFDEntry, IFDEntryFactory } from "./IFDEntry.model";

enum ByteAlign {
  BigEndian = 0x4d4d,
  LittleEndian = 0x4949,
}

enum TagMark {
  BigEndian = 0x002a,
  LittleEndian = 0x2a00,
}

/**
 * Reference: https://nightohl.tistory.com/entry/EXIF-Format
 */
export class ExifData {
  private _dataView: DataView;
  private _offset: number;
  private _size: number;
  private _firstIFDOffset: number;
  private _isLittle = true;

  constructor(arrayBuffer: ArrayBuffer, offset: number, length: number) {
    this._offset = offset;
    this._size = length;
    this._dataView = new DataView(arrayBuffer.slice(offset, offset + length));

    // NOTE: 실행 순서가 변경되면 안됩니다.
    this.validateExifHeader();
    this.validateByteAlign();
    this.validateTagMark();

    this._firstIFDOffset = this._dataView.getUint32(14, this._isLittle);
  }

  private validateExifHeader(): void {
    const exifHeader = readDataViewAsString(this._dataView, 4, 6);

    if (exifHeader !== "Exif\0\0") {
      throw new Error(
        `Invalid EXIF Header! Expected 'Exif\\0\\0', but got '${exifHeader}'.`
      );
    }
  }

  private validateByteAlign(): void {
    const byteAlign = this._dataView.getUint16(10);

    if (
      byteAlign !== ByteAlign.BigEndian &&
      byteAlign !== ByteAlign.LittleEndian
    ) {
      throw new Error(
        `Invalid Byte Align! Expected ${ByteAlign.BigEndian} or ${ByteAlign.LittleEndian}, but got ${byteAlign}.`
      );
    }

    this._isLittle = byteAlign === ByteAlign.LittleEndian;
  }

  private validateTagMark(): void {
    const tagMark = this._dataView.getUint16(12, this._isLittle);

    if (tagMark !== TagMark.BigEndian && tagMark !== TagMark.LittleEndian) {
      throw new Error(
        `Invalid Tag Mark! Expected ${TagMark.BigEndian} or ${TagMark.LittleEndian}, but got ${tagMark}.`
      );
    }
  }

  readIFD0Entries(): IFDEntry[] {
    const baseOffset = this._firstIFDOffset + 10; // NOTE: First IFD's Offset 값은 Byte Align Offset 값을 기준으로 합니다.
    const firstEntryOffset = baseOffset + 2; // NOTE: Entry Count 데이터 (2 Bytes)를 제외한 Offset.
    const entryCount = this._dataView.getUint16(baseOffset, this._isLittle);
    const entries: IFDEntry[] = [];

    for (let n = 0; n < entryCount; n++) {
      const entry = IFDEntryFactory(
        this._dataView,
        firstEntryOffset + 12 * n, // NOTE: IFD Entry는 12 Bytes로 구성됩니다.
        this._isLittle
      );

      entries.push(entry);
    }

    return entries;
  }
}
