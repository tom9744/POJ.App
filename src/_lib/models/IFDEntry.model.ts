import {
  COMPONENT_SIZE_BY_FORMAT,
  TagFormat,
} from "../constants/exif-tags.constant";
import { readDataViewAsString } from "../utils";

enum Signedness {
  Signed,
  Unsigend,
}

enum IntegerType {
  Byte = 1,
  Short = 2,
  Long = 4,
}

enum ActualNumberType {
  Float = 4,
  Double = 8,
}

export type IFDPayload = string | number | number[] | [number, number][];

export interface IIFDEntry {
  tag: number;
  format: number;
  formatString: string;
  componentCount: number;
  payload: number;
}

export abstract class IFDEntry implements IIFDEntry {
  constructor(
    private _dataView: DataView,
    private _offset: number,
    private _isLittle: boolean
  ) {}

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

  protected resolveStringData(): string {
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

  protected resolveUnsingedInteger(type: IntegerType): number[] {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: number[] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + type * n;

      switch (type) {
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

  protected resolveSingedInteger(type: IntegerType): number[] {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: number[] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + type * n;

      switch (type) {
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

  protected resolveRational(signedness: Signedness): [number, number][] {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: [number, number][] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + 8 * n;
      let numerator: number, denominator: number;

      switch (signedness) {
        case Signedness.Unsigend:
          numerator = this._dataView.getUint32(offset, this._isLittle);
          denominator = this._dataView.getUint32(offset + 4, this._isLittle);
          break;
        case Signedness.Signed:
          numerator = this._dataView.getInt32(offset, this._isLittle);
          denominator = this._dataView.getInt32(offset + 4, this._isLittle);
          break;
      }

      result.push([numerator, denominator]);
    }

    return result;
  }

  protected resolveFloat(type: ActualNumberType) {
    const baseOffset =
      this.payloadSize > 4 ? this.payload + 10 : this._offset + 8;
    const result: number[] = [];

    for (let n = 0; n < this.componentCount; n++) {
      const offset = baseOffset + type * n;

      switch (type) {
        case ActualNumberType.Float:
          result.push(this._dataView.getFloat32(offset, this._isLittle));
          break;
        case ActualNumberType.Double:
          result.push(this._dataView.getFloat64(offset, this._isLittle));
          break;
      }
    }

    return result;
  }

  abstract resolvePayload(): string | number | number[] | [number, number][];
}

export class IntegerIFDEntry extends IFDEntry {
  resolvePayload(): number[] {
    switch (this.format) {
      case TagFormat.UnsignedByte:
        return this.resolveUnsingedInteger(IntegerType.Byte);
      case TagFormat.UnsignedShort:
        return this.resolveUnsingedInteger(IntegerType.Short);
      case TagFormat.UnsignedLong:
        return this.resolveUnsingedInteger(IntegerType.Long);
      case TagFormat.SignedByte:
        return this.resolveSingedInteger(IntegerType.Byte);
      case TagFormat.SignedShort:
        return this.resolveSingedInteger(IntegerType.Short);
      case TagFormat.SignedLong:
        return this.resolveSingedInteger(IntegerType.Long);
      default:
        throw new Error("Invalid Interger IFDEntry");
    }
  }
}

export class ActualNumberIFDEntry extends IFDEntry {
  resolvePayload(): number[] {
    switch (this.format) {
      case TagFormat.SingleFloat:
        return this.resolveFloat(ActualNumberType.Float);
      case TagFormat.DoubleFloat:
        return this.resolveFloat(ActualNumberType.Double);
      default:
        throw new Error("Invalid Actual Number IFDEntry");
    }
  }
}

export class RatioalIFDEntry extends IFDEntry {
  resolvePayload(): [number, number][] {
    switch (this.format) {
      case TagFormat.UnsignedRational:
        return this.resolveRational(Signedness.Unsigend);
      case TagFormat.SignedRational:
        return this.resolveRational(Signedness.Signed);
      default:
        throw new Error("Invalid Ratioal IFDEntry");
    }
  }
}

export class StringIFDEntry extends IFDEntry {
  resolvePayload(): string {
    switch (this.format) {
      case TagFormat.ASCIIString:
        return this.resolveStringData();
      default:
        throw new Error("Invalid String IFDEntry");
    }
  }
}

export class UndefinedIFDEntry extends IFDEntry {
  resolvePayload(): number {
    return this.payload;
  }
}

export function IFDEntryFactory(
  dataView: DataView,
  offset: number,
  isLittle: boolean
): IFDEntry {
  switch (dataView.getUint16(offset + 2, isLittle)) {
    case TagFormat.ASCIIString:
      return new StringIFDEntry(dataView, offset, isLittle);
    case TagFormat.UnsignedByte:
    case TagFormat.UnsignedShort:
    case TagFormat.UnsignedLong:
    case TagFormat.SignedByte:
    case TagFormat.SignedShort:
    case TagFormat.SignedLong:
      return new IntegerIFDEntry(dataView, offset, isLittle);
    case TagFormat.UnsignedRational:
    case TagFormat.SignedRational:
      return new RatioalIFDEntry(dataView, offset, isLittle);
    case TagFormat.SingleFloat:
    case TagFormat.DoubleFloat:
      return new ActualNumberIFDEntry(dataView, offset, isLittle);
    default:
      return new UndefinedIFDEntry(dataView, offset, isLittle);
  }
}
