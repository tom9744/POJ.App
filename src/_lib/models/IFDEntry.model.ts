import {
  COMPONENT_SIZE_BY_FORMAT,
  TagFormat,
} from "../constants/exif-tags.constant";

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

  get payload(): number {
    return this._dataView.getUint32(this._offset + 8, this._isLittle);
  }

  get payloadSize(): number {
    return COMPONENT_SIZE_BY_FORMAT[this.format] * this.componentCount;
  }
}
