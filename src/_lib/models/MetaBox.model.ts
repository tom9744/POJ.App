import { readUint32AsString } from "../utils";

const BOX_TYPE_OFFSET = 4;

/**
 * According to ISO/IEC 14496.
 *
 * Link: https://sce.umkc.edu/faculty-sites/lizhu/teaching/2021.spring.video/ref/mp4.pdf
 */
enum ChildBoxType {
  HandlerBox = "hdlr",
  PrimaryItemBox = "pitm",
  DataInformationBox = "dinf",
  ItemLocationBox = "iloc",
  ItemProtectionBox = "ipro",
  ItemInfoBox = "iinf",
  ItemInfoEntry = "infe",
  IPMPControBox = "ipmc",
}

type ItemInfoEntry = {
  boxSize: number;
  itemId: number;
  itemProtectionIndex: number;
  itemName: string;
};

type ItemInfoBox = {
  boxSize: number;
  entryCount: number;
  itemInfos: ItemInfoEntry[];
};

export interface IMetaBox {
  size: number;
  itemInfoBox: ItemInfoBox | null;
}

export class MetaBox implements IMetaBox {
  private dataView: DataView;
  private ilocOffset = 0;
  private iinfOffset = 0;

  constructor(metaBoxArrayBuffer: ArrayBuffer) {
    this.dataView = new DataView(metaBoxArrayBuffer);

    this.validateBoxType();
    this.updateOffsets();
  }

  get size(): number {
    return this.dataView.byteLength;
  }

  get itemInfoBox(): ItemInfoBox | null {
    const itemInfos: ItemInfoEntry[] = [];
    const boxSize = this.dataView.getUint32(this.iinfOffset);
    const boxType = readUint32AsString(this.dataView, this.iinfOffset + 4);
    const entryCount = this.dataView.getUint16(this.iinfOffset + 12);

    if (boxType !== ChildBoxType.ItemInfoBox) {
      return null;
    }

    if (entryCount > 0) {
      let offset = this.iinfOffset + 14;

      while (offset < this.iinfOffset + boxSize) {
        const slidingWindow = readUint32AsString(this.dataView, offset);

        if (slidingWindow === ChildBoxType.ItemInfoEntry) {
          const baseOffset = offset - 4;

          itemInfos.push({
            boxSize: this.dataView.getUint32(baseOffset),
            itemId: this.dataView.getUint16(baseOffset + 12),
            itemProtectionIndex: this.dataView.getUint16(baseOffset + 14),
            itemName: readUint32AsString(this.dataView, baseOffset + 16),
          });

          offset += this.dataView.getUint32(baseOffset) - 4;
        }
        offset += 1;
      }
    }

    return { boxSize, entryCount, itemInfos };
  }

  private validateBoxType(): void {
    const boxType = readUint32AsString(this.dataView, BOX_TYPE_OFFSET);

    if (boxType !== "meta") {
      throw new Error("Invaild box type");
    }
  }

  private updateOffsets(): void {
    for (let offset = 0; offset < this.dataView.byteLength - 4; offset++) {
      const value = readUint32AsString(this.dataView, offset);

      if (value === ChildBoxType.ItemLocationBox) {
        this.ilocOffset = offset - 4;
      }

      if (value === ChildBoxType.ItemInfoBox) {
        this.iinfOffset = offset - 4;
      }
    }
  }

  /**
   * Treat an unsigned 8-bit integer into two unsigned 4-bit integers,
   * which consist of a value taken from the set of {0, 4, 8}.
   */
  private splitUint8(value: number): [number, number] {
    switch (value) {
      case 0:
        return [0, 0];
      case 4:
        return [0, 4];
      case 8:
        return [0, 8];
      case 64:
        return [4, 0];
      case 68:
        return [4, 4];
      case 72:
        return [4, 8];
      case 128:
        return [8, 0];
      case 132:
        return [8, 4];
      case 136:
        return [8, 8];
      default:
        throw new Error("An unexpected value has been passed.");
    }
  }
}
