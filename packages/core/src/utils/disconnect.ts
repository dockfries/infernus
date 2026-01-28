import { DisconnectException } from "core/exceptions";
import type { Player } from "core/components/player/entity";
import { onDisconnect } from "core/components/player/event";

export function stopWhenDisconnect<T>(player: Player, func: () => Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    if (!player.isConnected()) {
      reject(new DisconnectException(player.id));
      return;
    }
    const cancel = onDisconnect(({ player: player_, next }) => {
      if (player_.id === player.id) {
        const ret = next();
        reject(new DisconnectException(player_.id));
        return ret;
      }
      return next();
    });
    func().then(resolve).catch(reject).finally(cancel);
  });
}
