import dgram from "dgram";
import { Options } from "./interfaces";
import { makePacket, parseResponse } from "./utils";
import { RequestPacket } from "./enums";
import { ResponseTypeMap } from "./types";

export * from "./enums";
export * from "./interfaces";
export * from "./types";

export function sendQuery<T extends RequestPacket>(options: Options<T>) {
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
          options.timeout || 1 * 1000,
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

          parseResponse(responseBuffer, options.opcode, receiveTime - sendTime)
            .then((result) => {
              resolve(result as ResponseTypeMap[T]);
            })
            .catch(reject);
        });

        client.once("error", (err) => {
          clearReqTimer();
          reject(err);
        });
      },
    );
  });
}
