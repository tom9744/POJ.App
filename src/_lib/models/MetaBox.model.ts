import { readUint32AsString } from "../utils";

const BOX_TYPE_OFFSET = 4;

function findMetaBox(arrayBuffer: ArrayBuffer): {
  size: number;
  offset: number;
} {
  const dataView = new DataView(arrayBuffer);

  for (let offset = 0; offset < dataView.byteLength; offset++) {
    const value = readUint32AsString(dataView, offset);

    if (value === "meta") {
      return {
        offset: offset - 4,
        size: dataView.getUint32(offset - 4),
      };
    }
  }

  throw new Error("Could not find a meta box from the array buffer");
}

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

type ItemLocationEntry = {
  itemId: number;
  dataReferenceIndex: number;
  baseOffset: number;
  extentCount: number;
  extentInfos: {
    extentOffset: number;
    extentLength: number;
  }[];
};

type ItemLocationBox = {
  boxSize: number;
  offsetSize: number;
  lengthSize: number;
  baseOffsetSize: number;
  itemCount: number;
  items: ItemLocationEntry[];
};

export interface IMetaBox {
  itemInfoBox: ItemInfoBox | null;
}

export class MetaBox implements IMetaBox {
  private dataView: DataView;
  private offset = 0;
  private size = 0;
  private ilocOffset = 0;
  private iinfOffset = 0;

  constructor(arrayBuffer: ArrayBuffer) {
    const { offset, size } = findMetaBox(arrayBuffer);

    this.offset = offset;
    this.size = size;
    // NOTE: 오프셋 + 크기 = 필요한 총 길이
    this.dataView = new DataView(arrayBuffer.slice(0, offset + size));

    this.validateBoxType();
    this.setChildBoxOffsets();
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

  get itemLocationBox(): ItemLocationBox | null {
    const boxSize = this.dataView.getUint32(this.ilocOffset);
    const boxType = readUint32AsString(this.dataView, this.ilocOffset + 4);
    const firstByte = this.dataView.getUint8(this.ilocOffset + 12);
    const secontByte = this.dataView.getUint8(this.ilocOffset + 13);
    const [offsetSize, lengthSize] = this.splitUint8(firstByte);
    const baseOffsetSize = secontByte >> 4;
    const itemCount = this.dataView.getUint16(this.ilocOffset + 14);
    const items: ItemLocationEntry[] = [];

    if (boxType !== ChildBoxType.ItemLocationBox) {
      return null;
    }

    if (itemCount > 0) {
      let offset = this.ilocOffset + 16;

      while (offset < this.ilocOffset + boxSize) {
        const itemId = this.dataView.getUint16(offset);
        const dataReferenceIndex = this.dataView.getUint16(offset + 2);
        const baseOffset = this.dataView.getUint16(offset + 4); // NOTE: Should be double-checked!
        const extentCount = this.dataView.getUint16(offset + 6);
        const extentInfos: {
          extentOffset: number;
          extentLength: number;
        }[] = [];

        for (let n = 0; n < extentCount; n++) {
          extentInfos.push({
            extentOffset: this.dataView.getUint32(offset + 8 + 2 * n),
            extentLength: this.dataView.getUint32(offset + 10 + 2 * n),
          });
        }

        items.push({
          itemId,
          dataReferenceIndex,
          baseOffset,
          extentCount,
          extentInfos,
        });

        offset += 6 + (baseOffsetSize || 2) + offsetSize + lengthSize;
      }
    }

    return {
      boxSize,
      offsetSize,
      lengthSize,
      baseOffsetSize,
      itemCount,
      items,
    };
  }

  private validateBoxType(): void {
    const boxType = readUint32AsString(
      this.dataView,
      this.offset + BOX_TYPE_OFFSET
    );

    if (boxType !== "meta") {
      throw new Error("Invaild box type");
    }
  }

  private setChildBoxOffsets(): void {
    for (let offset = 0; offset < this.size - 4; offset++) {
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
