import { readDataViewAsString } from "../../utils";
import { IFD0 } from "./ImageFileDirectory/IFD0.model";
import { IFDPayload } from "./ImageFileDirectory/IFDEntry.model";
import { ImageFileDirectory } from "./ImageFileDirectory/ImageFileDirectory.model";

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
  private _ifd0: IFD0;
  private _subIFD: ImageFileDirectory;

  get IFD0Entries(): { [key: string]: IFDPayload } {
    return this._ifd0.entries.reduce((acc, entry) => {
      acc[entry.tagString] = entry.payload;
      return acc;
    }, {} as { [key: string]: IFDPayload });
  }

  get subIFDEntries(): { [key: string]: IFDPayload } {
    return this._subIFD.entries.reduce((acc, entry) => {
      acc[entry.tagString] = entry.payload;
      return acc;
    }, {} as { [key: string]: IFDPayload });
  }

  constructor(arrayBuffer: ArrayBuffer, offset: number, length: number) {
    this._offset = offset;
    this._size = length;
    this._dataView = new DataView(arrayBuffer.slice(offset, offset + length));

    // NOTE: 실행 순서가 변경되면 안됩니다.
    this.validateExifHeader();
    this.validateByteAlign();
    this.validateTagMark();

    this._firstIFDOffset = this._dataView.getUint32(14, this._isLittle);
    this._ifd0 = new IFD0(this._dataView, this._firstIFDOffset, this._isLittle);
    this._subIFD = new ImageFileDirectory(
      this._dataView,
      this._ifd0.subIFDsOffset,
      this._isLittle
    );
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
}
