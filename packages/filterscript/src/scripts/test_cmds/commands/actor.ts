import { DynamicActor, PlayerEvent } from "@infernus/core";

let test_actor_id: DynamicActor | null = null;

export function createActorCommands() {
  const actoratme = PlayerEvent.onCommandText(
    "actoratme",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      const { x, y, z } = pos;
      const ang = player.getFacingAngle().angle;
      test_actor_id = new DynamicActor({
        modelId: 305,
        x: x + 1.0,
        y: y + 1.0,
        z: z + 0.5,
        r: ang,
        invulnerable: true,
        health: 100.0,
      });
      test_actor_id.create();
      test_actor_id.setVirtualWorld(player.getVirtualWorld());
      return next();
    },
  );

  const actorground = PlayerEvent.onCommandText("actorground", ({ next }) => {
    test_actor_id?.applyAnimation(
      "BEACH",
      "ParkSit_M_loop",
      4.0,
      true,
      true,
      true,
      true,
    );
    return next();
  });

  const actorclear = PlayerEvent.onCommandText("actorclear", ({ next }) => {
    test_actor_id?.clearAnimations();
    return next();
  });

  const actorface = PlayerEvent.onCommandText(
    "actorface",
    ({ player, next }) => {
      const ang = player.getFacingAngle().angle;
      test_actor_id?.setFacingAngle(ang);
      return next();
    },
  );

  const actorpos = PlayerEvent.onCommandText("actorpos", ({ player, next }) => {
    const pos = player.getPos();
    if (!pos.ret) return next();
    const { x, y, z } = pos;
    test_actor_id?.setPos(x + 1.0, y + 1.0, z);
    return next();
  });

  return [actoratme, actorground, actorclear, actorface, actorpos];
}
