import dgram from "dgram";
import { Options } from "./interfaces";
import { makePacket, parseResponse } from "./utils";
import { RequestPacket } from "./enums";
import { ResponseTypeMap } from "./types";

export * from "./enums";
export * from "./interfaces";
export * from "./types";

export async function sendQuery<T extends RequestPacket>(options: Options<T>) {
  return new Promise<ResponseTypeMap[T] | null>((resolve, reject) => {
    const client = dgram.createSocket("udp4");
    const packet = makePacket<T>(options);

    const sendTime = Date.now();
    let receiveTime = 0;
    client.send(
      packet,
      0,
      packet.length,
      options.port,
      options.address,
      (err) => {
        if (err) return reject(err);

        let responseBuffer: Buffer | null = null;
        let interval: NodeJS.Timeout | null = setTimeout(
          () => client.close(),
          options.timeout || 10 * 1000,
        );

        function clearReqTimer() {
          if (interval) {
            clearTimeout(interval);
            interval = null;
          }
        }

        client.once("message", (msg) => {
          receiveTime = Date.now();
          responseBuffer = msg;
          client.close();
          clearReqTimer();
        });

        client.once("close", () => {
          clearReqTimer();

          if (!responseBuffer) {
            return resolve(null);
          }

          try {
            const result = parseResponse(
              responseBuffer,
              options.opcode,
              receiveTime - sendTime,
            ) as ResponseTypeMap[T];
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });

        client.once("error", (err) => {
          clearReqTimer();
          reject(err);
        });
      },
    );
  });
}
