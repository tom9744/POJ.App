import {
  COMPONENT_SIZE_BY_FORMAT,
  TagFormat,
} from "../constants/exif-tags.constant";
import { readDataViewAsString } from "../utils";

interface IIFDEntry {
  tag: number;
  format: number;
  formatString: string;
  componentCount: number;
  payload: number;
}

export class IFDEntry implements IIFDEntry {
  private _dataView: DataView;
  private _offset: number;
  private _isLittle: boolean;

  constructor(dataView: DataView, offset: number, isLittleEndian: boolean) {
    this._dataView = dataView;
    this._offset = offset;
    this._isLittle = isLittleEndian;
  }

  get tag(): number {
    return this._dataView.getUint16(this._offset, this._isLittle);
  }

  get format(): number {
    return this._dataView.getUint16(this._offset + 2, this._isLittle);
  }

  get formatString(): string {
    return TagFormat[this.format];
  }

  get componentCount(): number {
    return this._dataView.getUint32(this._offset + 4, this._isLittle);
  }

  // NOTE: 데이터 크기가 4 Bytes 이상인 경우, 데이터가 위치한 Offset이 기록되어 있습니다.
  get payload(): number {
    return this._dataView.getUint32(this._offset + 8, this._isLittle);
  }

  get payloadSize(): number {
    return COMPONENT_SIZE_BY_FORMAT[this.format] * this.componentCount;
  }

  private resolveStringData(): string {
    if (this.payloadSize > 4) {
      return readDataViewAsString(
        this._dataView,
        this.payload + 10, // NOTE: 데이터의 Offset 값은 Byte Align Offset 값을 기준으로 합니다.
        this.componentCount
      );
    }
    return readDataViewAsString(
      this._dataView,
      this._offset + 8,
      this.componentCount
    );
  }

  private resoveUnsingedInteger(byteSize: 1 | 2 | 4): number[] {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: number[] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + byteSize * n;

      switch (byteSize) {
        case 1:
          result.push(this._dataView.getUint8(offset));
          break;
        case 2:
          result.push(this._dataView.getUint16(offset, this._isLittle));
          break;
        case 4:
          result.push(this._dataView.getUint32(offset, this._isLittle));
          break;
      }
    }

    return result;
  }

  private resoveSingedInteger(byteSize: 1 | 2 | 4): number[] {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: number[] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + byteSize * n;

      switch (byteSize) {
        case 1:
          result.push(this._dataView.getInt8(offset));
          break;
        case 2:
          result.push(this._dataView.getInt16(offset, this._isLittle));
          break;
        case 4:
          result.push(this._dataView.getInt32(offset, this._isLittle));
          break;
      }
    }

    return result;
  }

  private resolveRational(type: "unsigned" | "signed"): [number, number][] {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: [number, number][] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + 8 * n;
      let numerator: number, denominator: number;

      switch (type) {
        case "unsigned":
          numerator = this._dataView.getUint32(offset, this._isLittle);
          denominator = this._dataView.getUint32(offset + 4, this._isLittle);
          break;
        case "signed":
          numerator = this._dataView.getInt32(offset, this._isLittle);
          denominator = this._dataView.getInt32(offset + 4, this._isLittle);
          break;
      }

      result.push([numerator, denominator]);
    }

    return result;
  }

  resolvePayload() {
    switch (this.format) {
      case TagFormat.UnsignedByte:
        return this.resoveUnsingedInteger(1);
      case TagFormat.ASCIIString:
        return this.resolveStringData();
      case TagFormat.UnsignedShort:
        return this.resoveUnsingedInteger(2);
      case TagFormat.UnsignedLong:
        return this.resoveUnsingedInteger(4);
      case TagFormat.UnsignedRational:
        return this.resolveRational("unsigned");
      case TagFormat.SignedByte:
        return this.resoveSingedInteger(1);
      case TagFormat.SignedShort:
        return this.resoveSingedInteger(2);
      case TagFormat.SignedLong:
        return this.resoveSingedInteger(4);
      case TagFormat.SignedRational:
        return this.resolveRational("signed");
      default:
        return this.payload;
    }
  }
}
