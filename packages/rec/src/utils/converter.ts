import { RecordTypesEnum } from "../enums";
import {
  HeaderDataBlock,
  OnFootDataBlock,
  VehicleDataBlock,
} from "./dataBlock";
import { BinaryReader } from "./reader";
import { BinaryWriter } from "./writer";

export async function recToJson(filePath: string) {
  const data: any[] = [];

  const reader = await BinaryReader.fromFile(filePath);

  const hdb = reader.read(new HeaderDataBlock());
  data.push(hdb);

  let corrupt = false;

  switch (hdb.type) {
    case RecordTypesEnum.NONE:
      return data;

    case RecordTypesEnum.ONFOOT: {
      if ((reader.getSize() - 8) % 72 !== 0) {
        corrupt = true;
      }
      break;
    }

    case RecordTypesEnum.DRIVER: {
      if ((reader.getSize() - 8) % 67 !== 0) {
        corrupt = true;
      }
      break;
    }

    default:
      corrupt = true;
      break;
  }

  if (corrupt) {
    throw new Error("File data format error");
  }

  let hydra = true;

  while (reader.hasMoreData()) {
    if (hdb.type === RecordTypesEnum.ONFOOT) {
      data.push(reader.read(new OnFootDataBlock()));
    } else {
      const vdb = reader.read(new VehicleDataBlock());
      if (
        vdb.hydraThrustAngleTrainSpeed.hydraThrustAngle[0] > 5000 ||
        vdb.hydraThrustAngleTrainSpeed.hydraThrustAngle[1] > 5000
      ) {
        hydra = false;
      }
      data.push(vdb);
    }
  }

  if (hdb.type === RecordTypesEnum.DRIVER) {
    hdb.hydra = hydra;
  }

  return data;
}

export function jsonToRec(filePath: string, data: any[]) {
  const header = data[0];

  if (
    !header.version ||
    ![
      RecordTypesEnum.NONE,
      RecordTypesEnum.ONFOOT,
      RecordTypesEnum.DRIVER,
    ].includes(header.type)
  ) {
    throw new Error("File data format error");
  }

  const writer = new BinaryWriter();

  const hdb = new HeaderDataBlock();

  hdb.version = header.version;
  hdb.type = header.type;

  writer.write(hdb);

  if (hdb.type === RecordTypesEnum.NONE) {
    return writer.writeFile(filePath);
  }

  for (let i = 0; i < data.length; i++) {
    if (hdb.type === RecordTypesEnum.ONFOOT) {
      const odb: any = new OnFootDataBlock();
      Object.keys(odb).forEach((key) => {
        if (typeof data[i][key] !== "undefined") {
          odb[key] = data[i][key];
        }
      });
      writer.write(odb);
    } else {
      const vdb: any = new VehicleDataBlock();
      Object.keys(vdb).forEach((key) => {
        if (typeof data[i][key] !== "undefined") {
          vdb[key] = data[i][key];
        }
      });
      writer.write(vdb);
    }
  }

  return writer.writeFile(filePath);
}
