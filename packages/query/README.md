# @infernus/query

[![npm](https://img.shields.io/npm/v/@infernus/query)](https://www.npmx.dev/package/@infernus/query) ![npm](https://img.shields.io/npm/dw/@infernus/query) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/query)

## Getting started

```sh
pnpm add @infernus/query
```

Simple API for send SA-MP queries with TypeScript Language.

Special thanks to [sampquery-c](https://github.com/Louzindev/sampquery-c).

## Example

```ts
import { RequestPacket, sendQuery } from "@infernus/query";

async function main() {
  try {
    const serverInfo = await sendQuery({
      address: "127.0.0.1",
      port: 7777,
      opcode: RequestPacket.INFORMATION,
    });

    if (!serverInfo) {
      console.error("No response received from the server.");
      return;
    }

    console.log(`Server ${serverInfo.hostname}`);
    console.log(`GameMode: ${serverInfo.gameMode}`);
    console.log(`Language: ${serverInfo.language}`);
    console.log(`Max players: ${serverInfo.maxPlayers}`);
    console.log(`Online players: ${serverInfo.playerCount}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    }
  }
}

main();
```
