import { readDataViewAsString } from "../../utils";
import { IFD0 } from "./ImageFileDirectory/IFD0.model";
import { IFDEntry, IFDPayload } from "./ImageFileDirectory/IFDEntry.model";
import { ImageFileDirectory } from "./ImageFileDirectory/ImageFileDirectory.model";

enum ByteAlign {
  BigEndian = 0x4d4d,
  LittleEndian = 0x4949,
}

enum TagMark {
  BigEndian = 0x002a,
  LittleEndian = 0x2a00,
}

type IFDEntrySummary = { [key: string]: IFDPayload };

/**
 * Reference: https://nightohl.tistory.com/entry/EXIF-Format
 */
export class ExifData {
  private _isLittle = true;
  private _IFD0: IFD0 | null = null;
  private _IFD1: ImageFileDirectory | null = null;
  private _EXIF: ImageFileDirectory | null = null;

  get IFD0(): IFDEntrySummary | null {
    if (!this._IFD0?.entries) {
      return null;
    }
    return this.formatEntries(this._IFD0.entries);
  }

  get IFD1(): IFDEntrySummary | null {
    if (!this._IFD1?.entries) {
      return null;
    }
    return this.formatEntries(this._IFD1.entries);
  }

  get EXIF(): IFDEntrySummary | null {
    if (!this._EXIF?.entries) {
      return null;
    }
    return this.formatEntries(this._EXIF.entries);
  }

  constructor(arrayBuffer: ArrayBuffer, offset: number, length: number) {
    const dataView = new DataView(arrayBuffer.slice(offset, offset + length));

    // NOTE: 실행 순서가 변경되면 안됩니다.
    this.checkExifHeader(dataView);
    this.checkByteAlign(dataView);
    this.checkTagMark(dataView);

    const offsetToIFD0 = dataView.getUint32(14, this._isLittle);
    this._IFD0 = new IFD0(dataView, offsetToIFD0, this._isLittle);

    if (this._IFD0.offsetToIFD1 > 0) {
      this._IFD1 = new ImageFileDirectory(
        dataView,
        this._IFD0.offsetToIFD1,
        this._isLittle
      );
    }

    if (this._IFD0.offsetToEXIF && this._IFD0.offsetToEXIF > 0) {
      this._EXIF = new ImageFileDirectory(
        dataView,
        this._IFD0.offsetToEXIF,
        this._isLittle
      );
    }
  }

  private checkExifHeader(dataView: DataView): void {
    const exifHeader = readDataViewAsString(dataView, 4, 6);

    if (exifHeader !== "Exif\0\0") {
      throw new Error(
        `Invalid EXIF Header! Expected 'Exif\\0\\0', but got '${exifHeader}'.`
      );
    }
  }

  private checkByteAlign(dataView: DataView): void {
    const byteAlign = dataView.getUint16(10);

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

  private checkTagMark(dataView: DataView): void {
    const tagMark = dataView.getUint16(12, this._isLittle);

    if (tagMark !== TagMark.BigEndian && tagMark !== TagMark.LittleEndian) {
      throw new Error(
        `Invalid Tag Mark! Expected ${TagMark.BigEndian} or ${TagMark.LittleEndian}, but got ${tagMark}.`
      );
    }
  }

  private formatEntries(entries: IFDEntry[]): IFDEntrySummary {
    return entries.reduce((acc, entry) => {
      acc[entry.tagString] = entry.payload;
      return acc;
    }, {} as IFDEntrySummary);
  }
}
