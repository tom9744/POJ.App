import { readDataViewAsString } from "../utils";
import {
  COMPONENT_SIZE_BY_FORMAT,
  TagFormat,
} from "../constants/exif-tags.constant";

enum ByteAlign {
  BigEndian = 0x4d4d,
  LittleEndian = 0x4949,
}

enum TagMark {
  BigEndian = 0x002a,
  LittleEndian = 0x2a00,
}

interface IFDEntry {
  tag: number;
  format: string;
  componentCount: number;
  payload: number;
  payloadSize: number;
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

  private readIFDEntry(offset: number): IFDEntry {
    const tag = this._dataView.getUint16(offset, this._isLittle);
    const format = this._dataView.getUint16(offset + 2, this._isLittle);
    const componentCount = this._dataView.getUint32(offset + 4, this._isLittle);
    const payloadSize = COMPONENT_SIZE_BY_FORMAT[format] * componentCount;

    return {
      tag,
      format: TagFormat[format],
      componentCount,
      payload: this._dataView.getUint32(offset + 8, this._isLittle),
      payloadSize,
    };
  }

  readIFD0Entries(): IFDEntry[] {
    const baseOffset = this._firstIFDOffset + 10; // NOTE: First IFD's Offset 값은 Byte Align Offset 값을 기준으로 합니다.
    const entryCount = this._dataView.getUint16(baseOffset, this._isLittle);
    const entries: IFDEntry[] = [];

    for (let n = 0; n < entryCount; n++) {
      // NOTE: IFD Entry는 12 Bytes로 구성됩니다.
      const entry = this.readIFDEntry(12 * n + baseOffset + 2);

      entries.push(entry);
    }

    return entries;
  }
}
