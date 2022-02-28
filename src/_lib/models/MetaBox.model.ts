import { MetaChildBoxType } from "../constants/box-type.constant";
import { readUint32AsString } from "../utils";
import { ItemLocationBox } from "./ItemLocationBox.model";

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

    if (boxType !== MetaChildBoxType.ItemInfoBox) {
      return null;
    }

    if (entryCount > 0) {
      let offset = this.iinfOffset + 14;

      while (offset < this.iinfOffset + boxSize) {
        const slidingWindow = readUint32AsString(this.dataView, offset);

        if (slidingWindow === MetaChildBoxType.ItemInfoEntry) {
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
    try {
      return new ItemLocationBox(this.dataView, this.ilocOffset);
    } catch (error) {
      console.error(error);
      return null; // TODO: More explicit error message.
    }
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

      if (value === MetaChildBoxType.ItemLocationBox) {
        this.ilocOffset = offset - 4;
      }

      if (value === MetaChildBoxType.ItemInfoBox) {
        this.iinfOffset = offset - 4;
      }
    }
  }
}
