// maxips FS limits the number of players connecting from a
// single IP address.

import { LogLevelEnum, Player, PlayerEvent } from "@infernus/core";
import type { IMaxIpsFS } from "./interfaces";

//---------------------------------------------
// GetNumberOfPlayersOnThisIP
// Returns the number of players connecting from the
// provided IP address

function getNumberOfPlayersOnThisIP(testIp: string) {
  return Player.getInstances().filter((p) => {
    return p.getIp().ip === testIp;
  }).length;
}

export const MaxIps: IMaxIpsFS = {
  name: "max_ips",
  load(options) {
    const maxConnections = options && options.maxConnections ? options.maxConnections : 3;

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      const connecting_ip = player.getIp().ip;
      const num_players_on_ip = getNumberOfPlayersOnThisIP(connecting_ip);
      if (num_players_on_ip > maxConnections) {
        samp.logprint(
          `MAXIPs: Connecting player(${player.id}) exceeded ${maxConnections} IP connections from ${connecting_ip}.`,
          LogLevelEnum.WARNING,
        );
        player.kick();
        return 1;
      }
      return next();
    });

    samp.logprint(
      `\n*** Player IP limiting FS (maxips) Loaded. Max connections from 1 IP = ${maxConnections}\n`,
      LogLevelEnum.INFO,
    );

    return [onConnect];
  },
  unload() {},
};
