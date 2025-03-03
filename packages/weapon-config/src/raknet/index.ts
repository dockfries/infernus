import { IPacket, OnFootSync, PacketIdList } from "@infernus/raknet";

const WC_PLAYER_SYNC = PacketIdList.OnFootSync;

// We should force users to use the raknet and remove the related code of SKY
IPacket(WC_PLAYER_SYNC, ({ bs, playerId, next }) => {
  const ofs = new OnFootSync(bs);
  const onFootData = ofs.readSync()!;
  console.log(onFootData.weaponId, playerId);
  return next();
});
