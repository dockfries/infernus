# @infernus/query — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

UDP-based SA-MP/open.mp server query tool.

```bash
pnpm add @infernus/core @infernus/query
```

## sendQuery

```typescript
import { sendQuery, RequestPacket } from "@infernus/query";

// Get server info
const info = await sendQuery({
  address: "127.0.0.1",
  port: 7777,
  opcode: RequestPacket.INFORMATION,
  timeout: 2000,
});
// → ServerInfo { isPassword, hostname, gameMode, language, maxPlayers, playerCount, rtt } | null
// On timeout or no response, sendQuery resolves null (does NOT throw).

// Get rules
const rules = await sendQuery({ address, opcode: RequestPacket.RULES });
// → ServerRule[] { ruleName, ruleValue } | null

// Get clients
const clients = await sendQuery({ address, opcode: RequestPacket.CLIENT_LIST });
// → Client[] { playerNick, score }

// Get detailed clients
const details = await sendQuery({ address, opcode: RequestPacket.DETAILED });
// → ClientDetail[] { playerNick, score, playerId, ping }
```

## Enums

```typescript
enum RequestPacket {
  CLIENT_LIST = 99,
  DETAILED = 100,
  INFORMATION = 105,
  RULES = 114,
}
```

## Exception

`QueryException` is thrown only when `address` is not a valid IPv4 address (in `makePacket`). **Timeout / no response resolves `null`** — it does not throw. Network-level socket errors reject with the raw `Error` from the socket, not a `QueryException`.

```typescript
import { QueryException } from "@infernus/query";
```

## Types

```typescript
interface Options<T extends RequestPacket> {
  address: string;
  port?: number;
  opcode?: T;
  timeout?: number;
}

type ResponseTypeMap = {
  [RequestPacket.INFORMATION]: ServerInfo;
  [RequestPacket.RULES]: ServerRule[];
  [RequestPacket.CLIENT_LIST]: Client[];
  [RequestPacket.DETAILED]: ClientDetail[];
};
```
