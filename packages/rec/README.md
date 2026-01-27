# @infernus/rec

[![npm](https://img.shields.io/npm/v/@infernus/rec)](https://www.npmx.dev/package/@infernus/rec) ![npm](https://img.shields.io/npm/dw/@infernus/rec) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/rec)

## Getting started

```sh
pnpm add @infernus/rec
```

File format converter from `.rec` to `.json` and vice versa, which NPCs use in SA-MP to play back recordings.

Special thanks to [samp-rec-to-csv](https://github.com/WoutProvost/samp-rec-to-csv).

## Example

```ts
import type { RecordTypesEnum } from "@infernus/rec";
import {
  jsonToRec,
  recToJson,
  HeaderDataBlock,
  OnFootDataBlock,
  VehicleDataBlock,
} from "@infernus/rec";

const hdb = new HeaderDataBlock();
hdb.type = RecordTypesEnum.ONFOOT;

const odb = new OnFootDataBlock();
odb.position = [1.1145, 1.514, 1.1919];

const hdb1 = new HeaderDataBlock();
hdb1.type = RecordTypesEnum.DRIVER;

const vdb = new VehicleDataBlock();
vdb.position = [1.1919, 1.514, 1.1145];

const onFootRec = "./on_foot_data.rec";
const inCarRec = "./vehicle_data.rec";
const testRec = "./test.rec";

jsonToRec(onFootRec, [hdb, odb]).then(() => {
  recToJson(onFootRec).then((res) => {
    console.log(res);
  });
});

jsonToRec(inCarRec, [hdb1, vdb]).then(() => {
  recToJson(inCarRec).then((res) => {
    console.log(res);
  });
});

recToJson(testRec).then((res) => {
  console.log(res);
});
```
