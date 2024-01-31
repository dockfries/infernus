import * as w from "core/wrapper/native";
import type { RecordTypesEnum } from "../../enums";
import { ERecordStatus } from "../../enums";

import { logger } from "../../logger";
import type { Player } from "../player";

export class Npc {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  private static recordStatus: ERecordStatus;
  static readonly connectNPC = w.ConnectNPC;
  static startRecordingPlayerData(
    player: Player,
    recordtype: RecordTypesEnum,
    recordname: string
  ): void {
    if (player.isRecording)
      return logger.warn("[NpcFunc]: It should be stopped before recording");
    w.StartRecordingPlayerData(player.id, recordtype, recordname);
    player.isRecording = true;
  }
  static stopRecordingPlayerData(player: Player): void {
    if (!player.isRecording)
      return logger.warn("[NpcFunc]: It should be started before stop");
    w.StopRecordingPlayerData(player.id);
    player.isRecording = false;
  }
  static startRecordingPlayback(
    playbacktype: RecordTypesEnum,
    recordname: string
  ): void {
    if (Npc.recordStatus >= ERecordStatus.start)
      return logger.warn("[NpcFunc]: The current status cannot be replayed");
    w.StartRecordingPlayback(playbacktype, recordname);
    Npc.recordStatus = ERecordStatus.start;
  }
  static stopRecordingPlayback(): void {
    if (Npc.recordStatus < ERecordStatus.start)
      return logger.warn("[NpcFunc]: The current status cannot be stopped");
    w.StopRecordingPlayback();
    Npc.recordStatus = ERecordStatus.none;
  }

  static pauseRecordingPlayback() {
    if (Npc.recordStatus !== ERecordStatus.start)
      return logger.warn("[NpcFunc]: The current status cannot be paused");
    w.PauseRecordingPlayback();
    Npc.recordStatus = ERecordStatus.pause;
  }
  static resumeRecordingPlayback() {
    if (Npc.recordStatus !== ERecordStatus.pause)
      return logger.warn("[NpcFunc]: The current status cannot be paused");
    w.ResumeRecordingPlayback();
    Npc.recordStatus = ERecordStatus.start;
  }
}
