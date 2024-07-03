// maxips FS limits the number of players connecting from a
// single IP address.

import type { IFilterScript } from "@infernus/core";
import { Player, PlayerEvent } from "@infernus/core";

export const MAX_CONNECTIONS_FROM_IP = 3;

//---------------------------------------------
// GetNumberOfPlayersOnThisIP
// Returns the number of players connecting from the
// provided IP address

function getNumberOfPlayersOnThisIP(test_ip: string) {
  return Player.getInstances().filter((p) => {
    return p.getIp() === test_ip;
  }).length;
}

export const MaxIps: IFilterScript = {
  name: "max_ips",
  load() {
    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      const connecting_ip = player.getIp();
      const num_players_on_ip = getNumberOfPlayersOnThisIP(connecting_ip);
      if (num_players_on_ip > MAX_CONNECTIONS_FROM_IP) {
        console.log(
          "MAXIPs: Connecting player(%d) exceeded %d IP connections from %s.",
          player.id,
          MAX_CONNECTIONS_FROM_IP,
          connecting_ip,
        );
        player.kick();
        return 1;
      }
      return next();
    });

    console.log(
      "\n*** Player IP limiting FS (maxips) Loaded. Max connections from 1 IP = %d\n",
      MAX_CONNECTIONS_FROM_IP,
    );

    return [onConnect];
  },
  unload() {},
};
