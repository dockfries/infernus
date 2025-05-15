import { PlayerEvent } from "@infernus/core";
import { sendLastSyncPacket } from "../../functions/internal/raknet";
import { isDying, inClassSelection } from "../../struct";

PlayerEvent.onStreamIn(({ player, forPlayer, next }) => {
  if (isDying.get(player.id) || inClassSelection.get(player.id)) {
    sendLastSyncPacket(player, forPlayer!, 0x2e040000 + 1150);
  }
  return next();
});
